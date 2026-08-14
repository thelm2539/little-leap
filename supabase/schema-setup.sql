-- ============================================================================
-- Little Leaps — full schema setup for a fresh Supabase project
-- ============================================================================
--
-- Run this ONCE, in the SQL Editor of a brand-new Supabase project, to build
-- the complete secure schema in a single pass. It is the end state of the three
-- files in supabase/migrations/ collapsed into one clean install — no
-- migrate-and-drop steps, because a new project starts empty.
--
-- Safe to re-run: everything is idempotent (drop-if-exists / create-if-not-
-- exists / create-or-replace), and it runs as one transaction, so a failure
-- rolls the whole thing back rather than leaving a half-built schema.
--
-- SECURITY MODEL
--   * A family is an opaque uuid, never anything a user types.
--   * Membership is granted ONLY by the create_family / redeem_family_invite
--     RPCs. The tables carry no client INSERT/UPDATE grant.
--   * Invite codes are ~65-bit, hashed at rest, expiring and use-capped.
--   * family_invites + invite_redeem_attempts are RLS-enabled with NO policies
--     and NO grants — reachable only through the SECURITY DEFINER RPCs.
-- ============================================================================

begin;

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.families (
  id         uuid primary key default gen_random_uuid(),
  birth_date date,
  baby_name  text,
  created_at timestamptz not null default now()
);

-- Sanity bounds only. CURRENT_DATE is deliberately NOT used in the constraint —
-- it is not immutable and would make dumps unrestorable. The real "not in the
-- future, not older than 6 years" rule lives in the RPCs below.
alter table public.families drop constraint if exists families_birth_date_sane;
alter table public.families
  add constraint families_birth_date_sane
  check (birth_date is null
         or (birth_date >= date '2000-01-01' and birth_date <= date '2100-01-01'));

create table if not exists public.family_members (
  user_id   uuid not null references auth.users(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (user_id, family_id)
);
create index if not exists family_members_family_idx
  on public.family_members (family_id);

create table if not exists public.activity_logs (
  id              uuid primary key default gen_random_uuid(),
  family_id       uuid not null references public.families(id) on delete cascade,
  activity_id     text not null,
  activity_name   text not null,
  domain          text not null,
  rating          text not null check (rating in ('engaged', 'neutral', 'fussy')),
  -- Baby's age in whole days at log time, so feedback stays interpretable over
  -- time. Nullable: null when no birth date was known when the rating was saved.
  logged_age_days int,
  logged_at       timestamptz not null default now()
);
create index if not exists activity_logs_family_logged_at_idx
  on public.activity_logs (family_id, logged_at desc);

-- Invites: only the SHA-256 hash of the code is stored, so a leak of this table
-- yields no working invites. The plaintext is returned once, at creation.
create table if not exists public.family_invites (
  code_hash  text primary key,
  family_id  uuid not null references public.families(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  max_uses   int  not null default 5 check (max_uses > 0),
  uses       int  not null default 0 check (uses >= 0),
  revoked_at timestamptz
);
create index if not exists family_invites_family_idx
  on public.family_invites (family_id);

-- Redemption attempts, for rate limiting.
create table if not exists public.invite_redeem_attempts (
  user_id      uuid not null references auth.users(id) on delete cascade,
  attempted_at timestamptz not null default now(),
  succeeded    boolean not null
);
create index if not exists invite_redeem_attempts_user_idx
  on public.invite_redeem_attempts (user_id, attempted_at desc);

-- ---------------------------------------------------------------------------
-- Membership predicate
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER so policies on family_members can consult the same table
-- without tripping infinite RLS recursion. Discloses nothing beyond whether the
-- caller belongs to the family they asked about.

create or replace function public.is_member(p_family_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.family_members
     where user_id = auth.uid()
       and family_id = p_family_id
  );
$$;

revoke execute on function public.is_member(uuid) from public, anon;
grant  execute on function public.is_member(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Invite code helpers
-- ---------------------------------------------------------------------------
-- Crockford base32: 32 symbols, so `% 32` over a random byte is unbiased.
-- Excludes I, L, O and U to avoid transcription errors and accidental words.
-- 13 symbols x 5 bits = 65 bits of entropy.

create or replace function public.generate_invite_code()
returns text
language plpgsql
volatile
set search_path = public, extensions, pg_temp
as $$
declare
  alphabet constant text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  bytes    bytea := extensions.gen_random_bytes(13);
  code     text  := '';
  i        int;
begin
  for i in 0..12 loop
    code := code || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
  end loop;
  return substr(code, 1, 4) || '-' || substr(code, 5, 4) || '-' || substr(code, 9, 5);
end;
$$;

revoke execute on function public.generate_invite_code() from public, anon, authenticated;

-- Normalise user input: strip separators, uppercase, and fold the characters
-- Crockford base32 treats as equivalent (O->0, I/L->1).
create or replace function public.normalize_invite_code(p_code text)
returns text
language sql
immutable
set search_path = pg_temp
as $$
  select translate(
           upper(regexp_replace(coalesce(p_code, ''), '[^a-zA-Z0-9]', '', 'g')),
           'OIL', '011'
         );
$$;

revoke execute on function public.normalize_invite_code(text) from public, anon;
grant  execute on function public.normalize_invite_code(text) to authenticated;

create or replace function public.hash_invite_code(p_code text)
returns text
language sql
immutable
set search_path = public, extensions, pg_temp
as $$
  select encode(extensions.digest(public.normalize_invite_code(p_code), 'sha256'), 'hex');
$$;

revoke execute on function public.hash_invite_code(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPCs — the only way membership is ever granted
-- ---------------------------------------------------------------------------

create or replace function public.create_family(p_birth_date date)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid       uuid := auth.uid();
  v_family_id uuid;
  v_count     int;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if p_birth_date is null
     or p_birth_date > current_date
     or p_birth_date < current_date - interval '6 years' then
    raise exception 'Birth date must be within the last 6 years and not in the future'
      using errcode = '22007';
  end if;

  select count(*) into v_count from public.family_members where user_id = v_uid;
  if v_count >= 5 then
    raise exception 'Too many families for this account' using errcode = '54000';
  end if;

  insert into public.families (birth_date) values (p_birth_date) returning id into v_family_id;
  insert into public.family_members (user_id, family_id) values (v_uid, v_family_id);

  return v_family_id;
end;
$$;

revoke execute on function public.create_family(date) from public, anon;
grant  execute on function public.create_family(date) to authenticated;


create or replace function public.create_family_invite(
  p_family_id uuid,
  p_ttl       interval default interval '90 days',
  p_max_uses  int      default 5
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_code text;
  v_live int;
begin
  if not public.is_member(p_family_id) then
    raise exception 'Not a member of this family' using errcode = '42501';
  end if;

  if p_ttl > interval '365 days' or p_ttl < interval '5 minutes' then
    raise exception 'Invalid invite lifetime' using errcode = '22023';
  end if;

  if p_max_uses < 1 or p_max_uses > 20 then
    raise exception 'Invalid invite use limit' using errcode = '22023';
  end if;

  select count(*) into v_live
    from public.family_invites
   where family_id = p_family_id
     and revoked_at is null
     and expires_at > now()
     and uses < max_uses;
  if v_live >= 10 then
    raise exception 'Too many active invites for this family' using errcode = '54000';
  end if;

  v_code := public.generate_invite_code();

  insert into public.family_invites (code_hash, family_id, created_by, expires_at, max_uses)
  values (public.hash_invite_code(v_code), p_family_id, auth.uid(), now() + p_ttl, p_max_uses);

  return v_code;
end;
$$;

revoke execute on function public.create_family_invite(uuid, interval, int) from public, anon;
grant  execute on function public.create_family_invite(uuid, interval, int) to authenticated;


create or replace function public.revoke_family_invite(p_family_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_member(p_family_id) then
    raise exception 'Not a member of this family' using errcode = '42501';
  end if;
  update public.family_invites
     set revoked_at = now()
   where family_id = p_family_id and revoked_at is null;
end;
$$;

revoke execute on function public.revoke_family_invite(uuid) from public, anon;
grant  execute on function public.revoke_family_invite(uuid) to authenticated;


-- Deliberately vague error so it cannot be used as an oracle to distinguish
-- "no such code" from "expired" or "used up".
create or replace function public.redeem_family_invite(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid       uuid := auth.uid();
  v_family_id uuid;
  v_recent    int;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select count(*) into v_recent
    from public.invite_redeem_attempts
   where user_id = v_uid
     and succeeded = false
     and attempted_at > now() - interval '1 hour';
  if v_recent >= 10 then
    raise exception 'Too many attempts. Please try again later.' using errcode = '54000';
  end if;

  select family_id into v_family_id
    from public.family_invites
   where code_hash = public.hash_invite_code(p_code)
     and revoked_at is null
     and expires_at > now()
     and uses < max_uses
     for update;

  if v_family_id is null then
    insert into public.invite_redeem_attempts (user_id, succeeded) values (v_uid, false);
    raise exception 'That code is not valid. Check it and try again.' using errcode = '22023';
  end if;

  update public.family_invites
     set uses = uses + 1
   where code_hash = public.hash_invite_code(p_code);

  insert into public.family_members (user_id, family_id)
  values (v_uid, v_family_id)
  on conflict (user_id, family_id) do nothing;

  insert into public.invite_redeem_attempts (user_id, succeeded) values (v_uid, true);

  return v_family_id;
end;
$$;

revoke execute on function public.redeem_family_invite(text) from public, anon;
grant  execute on function public.redeem_family_invite(text) to authenticated;


create or replace function public.set_family_birth_date(p_family_id uuid, p_birth_date date)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_member(p_family_id) then
    raise exception 'Not a member of this family' using errcode = '42501';
  end if;

  if p_birth_date is null
     or p_birth_date > current_date
     or p_birth_date < current_date - interval '6 years' then
    raise exception 'Birth date must be within the last 6 years and not in the future'
      using errcode = '22007';
  end if;

  update public.families set birth_date = p_birth_date where id = p_family_id;
end;
$$;

revoke execute on function public.set_family_birth_date(uuid, date) from public, anon;
grant  execute on function public.set_family_birth_date(uuid, date) to authenticated;


create or replace function public.set_baby_name(p_family_id uuid, p_name text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_member(p_family_id) then
    raise exception 'Not a member of this family' using errcode = '42501';
  end if;
  update public.families
     set baby_name = nullif(btrim(p_name), '')
   where id = p_family_id;
end;
$$;

revoke execute on function public.set_baby_name(uuid, text) from public, anon;
grant  execute on function public.set_baby_name(uuid, text) to authenticated;


-- GDPR erasure. Removes the caller's memberships and hard-deletes any family
-- left with no members (which cascades to its logs and invites).
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  create temp table _orphan_candidates on commit drop as
    select family_id from public.family_members where user_id = v_uid;

  delete from public.family_members where user_id = v_uid;

  delete from public.families f
   where f.id in (select family_id from _orphan_candidates)
     and not exists (select 1 from public.family_members m where m.family_id = f.id);
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant  execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.families               enable row level security;
alter table public.family_members         enable row level security;
alter table public.activity_logs          enable row level security;
alter table public.family_invites         enable row level security;
alter table public.invite_redeem_attempts enable row level security;

-- Start from zero: nothing is reachable unless a policy plus a grant says so.
revoke all on public.families               from anon, authenticated;
revoke all on public.family_members         from anon, authenticated;
revoke all on public.activity_logs          from anon, authenticated;
revoke all on public.family_invites         from anon, authenticated;
revoke all on public.invite_redeem_attempts from anon, authenticated;

grant select on public.families to authenticated;
drop policy if exists "families: members read" on public.families;
create policy "families: members read" on public.families
  for select to authenticated
  using (public.is_member(id));

grant select on public.family_members to authenticated;
drop policy if exists "family_members: members read" on public.family_members;
create policy "family_members: members read" on public.family_members
  for select to authenticated
  using (public.is_member(family_id));

-- activity_logs: members read, append, and delete (erasure). No UPDATE — the
-- log is append-only, which keeps history honest.
grant select, insert, delete on public.activity_logs to authenticated;

drop policy if exists "activity_logs: members read"   on public.activity_logs;
drop policy if exists "activity_logs: members append" on public.activity_logs;
drop policy if exists "activity_logs: members delete" on public.activity_logs;

create policy "activity_logs: members read" on public.activity_logs
  for select to authenticated
  using (public.is_member(family_id));

create policy "activity_logs: members append" on public.activity_logs
  for insert to authenticated
  with check (public.is_member(family_id));

create policy "activity_logs: members delete" on public.activity_logs
  for delete to authenticated
  using (public.is_member(family_id));

-- family_invites + invite_redeem_attempts: RLS enabled, NO policies, NO grants.
-- Reachable only through the SECURITY DEFINER RPCs above. Do not add a policy.

grant all on public.families               to service_role;
grant all on public.family_members         to service_role;
grant all on public.activity_logs          to service_role;
grant all on public.family_invites         to service_role;
grant all on public.invite_redeem_attempts to service_role;

-- ---------------------------------------------------------------------------
-- Content management (activities, milestones) — see
-- supabase/migrations/20260812120000_content_management.sql for the full
-- rationale. Lets content move without a code deploy: the app reads
-- status = 'published' rows; a separate low-privilege content_curator role
-- can only write status = 'draft' rows, enforced by RLS below.
-- ---------------------------------------------------------------------------

-- Scoped credential for an external content-curation agent. No grants on any
-- other table in the schema — a compromised curator credential can edit
-- draft content and nothing else. Created before the tables/policies below
-- that reference it.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'content_curator') then
    create role content_curator with login;
  end if;
end
$$;

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
  sources             jsonb not null default '[]',
  short_term_benefits text[],
  long_term_benefits  text[],
  status              text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  version             int not null default 1,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  updated_by          text
);

drop trigger if exists touch_content_activities on public.content_activities;
create trigger touch_content_activities
  before update on public.content_activities
  for each row execute function public.touch_updated_at();

alter table public.content_activities enable row level security;

drop policy if exists "published activities are public"          on public.content_activities;
drop policy if exists "content_curator can read all activities"  on public.content_activities;
drop policy if exists "content_curator can insert draft activities" on public.content_activities;
drop policy if exists "content_curator can update draft activities" on public.content_activities;

create policy "published activities are public" on public.content_activities
  for select to anon, authenticated
  using (status = 'published');

create policy "content_curator can read all activities" on public.content_activities
  for select to content_curator
  using (true);

create policy "content_curator can insert draft activities" on public.content_activities
  for insert to content_curator
  with check (status = 'draft');

create policy "content_curator can update draft activities" on public.content_activities
  for update to content_curator
  using (status = 'draft')
  with check (status = 'draft');

create table if not exists public.content_milestones (
  id                text primary key,
  name              text not null,
  domain            text not null check (domain in ('sensory', 'motor', 'cognitive', 'social-language', 'sleep')),
  kind              text check (kind in ('achievement', 'disruption')),
  week_start        int not null check (week_start >= 0),
  week_peak         int not null check (week_peak >= 0),
  week_end          int not null check (week_end >= week_start),
  mechanism         text not null,
  parent_can_see    text[] not null,
  activity_ids      text[] not null default '{}',
  resources         jsonb not null default '[]',
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

drop policy if exists "published milestones are public"           on public.content_milestones;
drop policy if exists "content_curator can read all milestones"   on public.content_milestones;
drop policy if exists "content_curator can insert draft milestones" on public.content_milestones;
drop policy if exists "content_curator can update draft milestones" on public.content_milestones;

create policy "published milestones are public" on public.content_milestones
  for select to anon, authenticated
  using (status = 'published');

create policy "content_curator can read all milestones" on public.content_milestones
  for select to content_curator
  using (true);

create policy "content_curator can insert draft milestones" on public.content_milestones
  for insert to content_curator
  with check (status = 'draft');

create policy "content_curator can update draft milestones" on public.content_milestones
  for update to content_curator
  using (status = 'draft')
  with check (status = 'draft');

grant usage on schema public to content_curator;
grant select, insert, update on public.content_activities to content_curator;
grant select, insert, update on public.content_milestones to content_curator;

grant all on public.content_activities to service_role;
grant all on public.content_milestones to service_role;

commit;
