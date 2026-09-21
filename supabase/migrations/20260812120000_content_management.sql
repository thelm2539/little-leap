-- ============================================================================
-- Content management: activities and milestones move from static TS files
-- into the database, so they can be updated without a code deploy.
-- ============================================================================
--
-- Problem this solves: ACTIVITIES (data.ts) and MILESTONES (milestones.ts)
-- are hardcoded arrays today. Any content change — new activity, fixed DOI,
-- reworded milestone text — requires a code review and a full app deploy.
-- Once this ships to an app store, a content-only change would mean a new
-- binary and App Store review, which is the wrong tool for a wording fix.
--
-- Design:
--   - content_activities / content_milestones mirror the existing Activity /
--     Milestone TS interfaces (see data.ts, milestones.ts) almost field for
--     field, so the client-side migration is a rename, not a redesign.
--   - `status` (draft | published | archived) gates visibility. The running
--     app only ever reads status = 'published' rows (RLS-enforced below) —
--     same "RLS is the security boundary" model as the rest of this schema.
--   - A separate low-privilege Postgres role, content_curator, is meant for
--     an external content-curation agent (human or Claude-driven). It can
--     INSERT and UPDATE rows, but only ever in 'draft' state — RLS with
--     check (status = 'draft') enforces this at the database level, so the
--     curator role is structurally incapable of publishing anything itself,
--     no matter what the client sends.
--   - Promoting draft -> published is a deliberate manual step for now: run
--     as the table owner (e.g. in the Supabase SQL editor), which bypasses
--     RLS. No promote UI/RPC yet — add one once there's an actual review
--     screen; a manual UPDATE is enough for the volume of changes at launch.
--   - activity_ids on a milestone is a soft reference to content_activities.id
--     (text[], not a real foreign key — Postgres has no native array FK).
--     Validate the references in whatever curates content, not the database.
--
-- content_curator has NO grants on any other table (families, activity_logs,
-- etc.) — a compromised or misbehaving curator credential can edit draft
-- content and nothing else, a completely different blast radius from the
-- app's own anon/publishable key.
--
-- IMPORTANT — after running this migration, set a password for the curator
-- role separately (do not commit a password to a migration file):
--   alter role content_curator with password '<generate one, store it out of git>';
-- Then hand the curating agent a direct Postgres connection string (Project
-- Settings -> Database -> Connection string), NOT the anon/publishable key —
-- this role isn't reachable through PostgREST without custom JWT claims,
-- which is unnecessary complexity for a single trusted back-office writer.
--
-- Additive and idempotent; safe on a live database. Nothing here changes
-- how the app currently reads ACTIVITIES/MILESTONES — that swap is a
-- separate, client-side change made once these tables are seeded.
-- ============================================================================

begin;

-- ── content_curator role ─────────────────────────────────────────────────────
-- Scoped credential for an external content-curation agent. Table grants are
-- deliberately narrow: INSERT/UPDATE on the two content tables only, nothing
-- else in the schema. RLS policies below further restrict it to draft rows.
-- Created before the tables/policies that reference it.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'content_curator') then
    create role content_curator with login;
  end if;
end
$$;

-- ── Shared updated_at trigger ────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── content_activities ───────────────────────────────────────────────────────
create table if not exists public.content_activities (
  id                  text primary key,
  title               text not null,
  domain              text not null check (domain in ('sensory', 'motor', 'cognitive', 'social-language', 'sleep')),
  sub_domain          text check (sub_domain in (
                        'tactile', 'vestibular-motor', 'multi-sensory',
                        'contrast-pattern', 'visual-tracking',
                        'auditory', 'social-communication', 'language-exposure',
                        'attention', 'causal-learning', 'social-cognition',
                        'sleep-environment', 'sleep-routine'
                      )),
  age_window_weeks   text not null,
  process_supported  text not null,
  evidence_basis     text not null,
  instructions       text[] not null,
  duration_minutes   int not null check (duration_minutes >= 0),
  why_it_works       text not null,
  week_recommended   int not null check (week_recommended >= 0),
  sources             jsonb not null default '[]',            -- [{citation, url}]
  short_term_benefits text[],
  long_term_benefits  text[],
  status              text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  version             int not null default 1,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  updated_by          text                                     -- free-text label: 'seed', 'content-curator-agent', an email — not an auth.users FK, the curator isn't an app user
);

drop trigger if exists touch_content_activities on public.content_activities;
create trigger touch_content_activities
  before update on public.content_activities
  for each row execute function public.touch_updated_at();

alter table public.content_activities enable row level security;

create policy "published activities are public"
  on public.content_activities
  for select
  to anon, authenticated
  using (status = 'published');

create policy "content_curator can read all activities"
  on public.content_activities
  for select
  to content_curator
  using (true);

create policy "content_curator can insert draft activities"
  on public.content_activities
  for insert
  to content_curator
  with check (status = 'draft');

create policy "content_curator can update draft activities"
  on public.content_activities
  for update
  to content_curator
  using (status = 'draft')
  with check (status = 'draft');

-- ── content_milestones ───────────────────────────────────────────────────────
create table if not exists public.content_milestones (
  id                text primary key,
  name              text not null,
  domain            text not null check (domain in ('sensory', 'motor', 'cognitive', 'social-language', 'sleep')),
  kind              text check (kind in ('achievement', 'disruption')),  -- null => 'achievement', see milestoneKind()
  week_start        int not null check (week_start >= 0),
  week_peak         int not null check (week_peak >= 0),
  week_end          int not null check (week_end >= week_start),
  mechanism         text not null,
  parent_can_see    text[] not null,
  activity_ids      text[] not null default '{}',               -- soft reference to content_activities.id
  resources         jsonb not null default '[]',                -- [{title, doi}]
  check_in          text not null,
  accelerator       text not null,
  latest_research   text not null,
  status            text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  version           int not null default 1,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  updated_by        text
);

drop trigger if exists touch_content_milestones on public.content_milestones;
create trigger touch_content_milestones
  before update on public.content_milestones
  for each row execute function public.touch_updated_at();

alter table public.content_milestones enable row level security;

create policy "published milestones are public"
  on public.content_milestones
  for select
  to anon, authenticated
  using (status = 'published');

create policy "content_curator can read all milestones"
  on public.content_milestones
  for select
  to content_curator
  using (true);

create policy "content_curator can insert draft milestones"
  on public.content_milestones
  for insert
  to content_curator
  with check (status = 'draft');

create policy "content_curator can update draft milestones"
  on public.content_milestones
  for update
  to content_curator
  using (status = 'draft')
  with check (status = 'draft');

grant usage on schema public to content_curator;
grant select, insert, update on public.content_activities to content_curator;
grant select, insert, update on public.content_milestones to content_curator;

commit;
