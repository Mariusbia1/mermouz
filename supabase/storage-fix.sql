insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Les médias du portfolio sont publics" on storage.objects;
drop policy if exists "L’administrateur ajoute les médias" on storage.objects;
drop policy if exists "L’administrateur modifie les médias" on storage.objects;
drop policy if exists "L’administrateur supprime les médias" on storage.objects;

create policy "Les médias du portfolio sont publics"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio-media');

create policy "L’administrateur ajoute les médias"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and (select public.is_portfolio_admin())
  );

create policy "L’administrateur modifie les médias"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (select public.is_portfolio_admin())
  );

create policy "L’administrateur supprime les médias"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (select public.is_portfolio_admin())
  );
