-- ============================================================================
-- Secure family model
-- ============================================================================
--
-- WHY THIS MIGRATION EXISTS
--
-- The previous model used `family_key` (a ~21-bit code like "bloom-haven-4729")
-- as BOTH the public family identifier AND the sole access credential. The RLS
-- policy on family_members was:
--
--     USING (auth_uid = auth.uid()) WITH CHECK (auth_uid = auth.uid())
--
-- That verifies you are writing YOUR OWN row, but never that you are entitled
-- to the family_key you put in it. So any anonymous user could:
--
--     1. signInAnonymously()                       -- free, unlimited, no captcha
--     2. upsert({auth_uid: <self>, family_key: X}) -- passes WITH CHECK
--     3. select * from activity_logs               -- reads family X's data
--
-- ...and iterate over the whole 2.3M keyspace, confirming each guess by whether
-- rows came back. Full read/write access to arbitrary families.
--
-- THE FIX: separate identity from secret.
--
--   * families.id        -- an opaque uuid, never typed by a human
--   * family_invites     -- high-entropy (~65 bit), hashed, expiring, use-capped
--   * family_members     -- NOT client-writable; only SECURITY DEFINER RPCs insert
--
-- Membership can now only be acquired by redeeming a valid invite. Guessing is
-- infeasible, and every invite can be revoked and expires on its own.
--
-- DATA MIGRATION: existing family_keys become families rows. Note that
-- birth_date was never actually a column (the client stored it in localStorage
-- and defended against the missing column with try/catch), so it starts NULL
-- here; the client backfills it from localStorage on next load.
-- ============================================================================

begin;

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- 1. families
-- ---------------------------------------------------------------------------

create table if not exists public.families (
  id                uuid primary key default gen_random_uuid(),
  birth_date        date,
  created_at        timestamptz not null default now(),
  -- Temporary: maps old family_key values during this migration. Dropped below.
  legacy_family_key text
);

-- Sanity bounds only. CURRENT_DATE is deliberately NOT used here -- it is not
-- immutable and makes dumps unrestorable. The real "not in the future, not
-- older than 6 years" validation lives in set_family_birth_date() below.
alter table public.families
  drop constraint if exists families_birth_date_sane;
alter table public.families
  add constraint families_birth_date_sane
  check (birth_date is null
         or (birth_date >= date '2000-01-01' and birth_date <= date '2100-01-01'));

-- ---------------------------------------------------------------------------
-- 2. Migrate existing family_key values into families
-- ---------------------------------------------------------------------------

insert into public.families (legacy_family_key)
select distinct k
from (
  select family_key as k from public.family_members
  union
  select family_key      from public.activity_logs
) s
where k is not null
  and not exists (select 1 from public.families f where f.legacy_family_key = s.k);

-- ---------------------------------------------------------------------------
-- 3. Rebuild family_members around family_id
-- ---------------------------------------------------------------------------

alter table public.family_members
  add column if not exists family_id uuid references public.families(id) on delete cascade;

update public.family_members fm
   set family_id = f.id
  from public.families f
 where f.legacy_family_key = fm.family_key
   and fm.family_id is null;

-- Any row we could not map has no reachable family; it was orphaned already.
delete from public.family_members where family_id is null;

alter table public.family_members alter column family_id set not null;
alter table public.family_members drop column if exists family_key;
alter table public.family_members drop constraint if exists family_members_auth_uid_key;

-- Dropping `id` also drops the primary key that depended on it.
alter table public.family_members drop column if exists id;
alter table public.family_members rename column auth_uid to user_id;
alter table public.family_members add primary key (user_id, family_id);

create index if not exists family_members_family_idx
  on public.family_members (family_id);

-- ---------------------------------------------------------------------------
-- 4. Rebuild activity_logs around family_id
-- ---------------------------------------------------------------------------

alter table public.activity_logs
  add column if not exists family_id uuid references public.families(id) on delete cascade;

update public.activity_logs al
   set family_id = f.id
  from public.families f
 where f.legacy_family_key = al.family_key
   and al.family_id is null;

delete from public.activity_logs where family_id is null;

alter table public.activity_logs alter column family_id set not null;
drop index if exists public.activity_logs_family_logged_at_idx;
alter table public.activity_logs drop column if exists family_key;

create index activity_logs_family_logged_at_idx
  on public.activity_logs (family_id, logged_at desc);

-- The legacy mapping column has served its purpose.
alter table public.families drop column if exists legacy_family_key;

-- ---------------------------------------------------------------------------
-- 5. Invites: hashed, expiring, use-capped
-- ---------------------------------------------------------------------------
--
-- Only the SHA-256 hash of the code is stored, so a leak of this table does not
-- yield working invites. The plaintext is returned exactly once, at creation.

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

-- Redemption attempts, for rate limiting. Rows older than a day are noise.
create table if not exists public.invite_redeem_attempts (
  user_id      uuid not null references auth.users(id) on delete cascade,
  attempted_at timestamptz not null default now(),
  succeeded    boolean not null
);

create index if not exists invite_redeem_attempts_user_idx
  on public.invite_redeem_attempts (user_id, attempted_at desc);

-- ---------------------------------------------------------------------------
-- 6. Membership predicate
-- ---------------------------------------------------------------------------
--
-- SECURITY DEFINER so that policies on family_members can consult the same
-- table without tripping infinite RLS recursion. It discloses nothing beyond
-- whether the *caller* belongs to the family they asked about.

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
-- 7. Invite code generation
-- ---------------------------------------------------------------------------
--
-- Crockford base32: 32 symbols, so `% 32` over a random byte is unbiased.
-- Excludes I, L, O and U to avoid transcription errors and accidental words.
-- 13 symbols x 5 bits = 65 bits of entropy (vs. ~21 bits before).

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
  -- Grouped for readability: XXXX-XXXX-XXXXX
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
-- 8. RPCs -- the only way membership is ever granted
-- ---------------------------------------------------------------------------

-- Create a family and enrol the caller as its first member.
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

  -- Cheap abuse brake: anonymous sign-ups are free, so cap families per user.
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


-- Mint an invite. Returns the plaintext code ONCE; only the hash is persisted.
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

  -- Bound the number of simultaneously-valid invites per family.
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


-- Revoke an invite immediately (e.g. shared with the wrong person).
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


-- Redeem an invite. Rate limited, and deliberately vague in its error message
-- so it cannot be used as an oracle to distinguish "no such code" from
-- "expired" or "used up".
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

  -- Defence in depth: 65-bit codes are not brute-forceable, but this also
  -- blunts credential-stuffing of leaked codes. Enable captcha on anonymous
  -- sign-in too, or an attacker simply rotates uids to reset this counter.
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


-- Birth date updates go through an RPC so the "not in the future, not older
-- than 6 years" rule is enforced server-side rather than by an input's max=.
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
-- 9. RLS
-- ---------------------------------------------------------------------------

drop policy if exists "own row only"      on public.family_members;
drop policy if exists "open access"       on public.activity_logs;
drop policy if exists "select own family" on public.activity_logs;
drop policy if exists "insert own family" on public.activity_logs;

alter table public.families              enable row level security;
alter table public.family_members        enable row level security;
alter table public.activity_logs         enable row level security;
alter table public.family_invites        enable row level security;
alter table public.invite_redeem_attempts enable row level security;

-- Start from zero: no table is reachable by anon, and nothing is writable
-- unless a policy plus a grant below says so.
revoke all on public.families               from anon, authenticated;
revoke all on public.family_members         from anon, authenticated;
revoke all on public.activity_logs          from anon, authenticated;
revoke all on public.family_invites         from anon, authenticated;
revoke all on public.invite_redeem_attempts from anon, authenticated;

-- families: readable by members. Writes go through RPCs only.
grant select on public.families to authenticated;
create policy "families: members read" on public.families
  for select to authenticated
  using (public.is_member(id));

-- family_members: members can see who else is in their family. RPC-only writes.
grant select on public.family_members to authenticated;
create policy "family_members: members read" on public.family_members
  for select to authenticated
  using (public.is_member(family_id));

-- activity_logs: members read, append, and delete (erasure). No UPDATE -- the
-- log is append-only, which keeps history honest.
grant select, insert, delete on public.activity_logs to authenticated;

create policy "activity_logs: members read" on public.activity_logs
  for select to authenticated
  using (public.is_member(family_id));

create policy "activity_logs: members append" on public.activity_logs
  for insert to authenticated
  with check (public.is_member(family_id));

create policy "activity_logs: members delete" on public.activity_logs
  for delete to authenticated
  using (public.is_member(family_id));

-- family_invites and invite_redeem_attempts: RLS enabled with NO policies and
-- NO grants. Unreachable via PostgREST; the SECURITY DEFINER RPCs above are the
-- only path in. This is intentional -- do not add a policy here.

grant all on public.families               to service_role;
grant all on public.family_members         to service_role;
grant all on public.activity_logs          to service_role;
grant all on public.family_invites         to service_role;
grant all on public.invite_redeem_attempts to service_role;

commit;
