-- ============================================================================
-- Activity log: capture the baby's relative age at log time
-- ============================================================================
--
-- Adds logged_age_days to activity_logs so each rating carries the baby's age
-- (in whole days) at the moment it was recorded. This keeps the "living record"
-- of how an activity was received interpretable over time — fussy at 6 weeks vs
-- engaged at 12 weeks are very different signals.
--
-- Additive, nullable, and idempotent — safe to run on a live database with
-- existing rows (they simply keep NULL). No RLS or grant change: the column
-- inherits the table's existing policies.
--
-- The full fresh-install schema in supabase/schema-setup.sql already includes
-- this column; this migration brings an already-provisioned database up to date.
-- ============================================================================

alter table public.activity_logs
  add column if not exists logged_age_days int;
