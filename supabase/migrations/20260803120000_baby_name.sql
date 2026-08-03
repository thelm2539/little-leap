-- ============================================================================
-- Baby name on the family (shared across caregivers)
-- ============================================================================
--
-- Adds families.baby_name and a set_baby_name RPC so the name a parent sets is
-- stored on the shared family row and inherited by a partner's device — same
-- pattern as birth date. Previously the name lived only in localStorage.
--
-- Additive and idempotent; safe on a live database (existing families keep a
-- NULL name until set). schema-setup.sql includes this for fresh projects.
-- ============================================================================

begin;

alter table public.families
  add column if not exists baby_name text;

-- Writes go through an RPC (families has no client UPDATE grant), so membership
-- is enforced server-side. Empty/whitespace names are normalised to NULL.
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

commit;
