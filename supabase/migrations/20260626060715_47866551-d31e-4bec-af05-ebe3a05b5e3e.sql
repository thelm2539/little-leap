create table public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  family_key text not null,
  activity_id text not null,
  activity_name text not null,
  domain text not null,
  rating text not null check (rating in ('engaged', 'neutral', 'fussy')),
  logged_at timestamptz not null default now()
);

create index activity_logs_family_logged_at_idx on public.activity_logs (family_key, logged_at desc);

grant select, insert, update, delete on public.activity_logs to anon;
grant select, insert, update, delete on public.activity_logs to authenticated;
grant all on public.activity_logs to service_role;

alter table public.activity_logs enable row level security;

create policy "open access" on public.activity_logs for all using (true) with check (true);