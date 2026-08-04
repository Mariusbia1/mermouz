-- Active les mises à jour instantanées des demandes dans le dashboard.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'contact_requests'
  ) then
    alter publication supabase_realtime add table public.contact_requests;
  end if;
end $$;

create index if not exists contact_requests_status_created_idx
  on public.contact_requests (status, created_at desc);
