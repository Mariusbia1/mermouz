create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Les contenus sont visibles par tous"
  on public.site_settings for select to anon, authenticated using (true);

create policy "L’administrateur gère les contenus"
  on public.site_settings for all to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

create policy "Les médias du portfolio sont publics"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio-media');

create policy "L’administrateur ajoute les médias"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()));

create policy "L’administrateur modifie les médias"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()));

create policy "L’administrateur supprime les médias"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-media' and (select public.is_portfolio_admin()));
