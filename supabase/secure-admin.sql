create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select auth.jwt() ->> 'email') = 'mariusbiaou75@gmail.com', false);
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

drop policy if exists "Les projets publiés sont visibles" on public.projects;
drop policy if exists "Les services actifs sont visibles" on public.services;
drop policy if exists "L’administrateur gère les demandes" on public.contact_requests;
drop policy if exists "L’administrateur consulte les visites" on public.website_visits;
drop policy if exists "L’administrateur gère les projets" on public.projects;
drop policy if exists "L’administrateur gère les services" on public.services;

create policy "Les projets publiés sont visibles"
  on public.projects for select to anon, authenticated
  using (status = 'published' or (select public.is_portfolio_admin()));

create policy "Les services actifs sont visibles"
  on public.services for select to anon, authenticated
  using (is_active = true or (select public.is_portfolio_admin()));

create policy "L’administrateur gère les demandes"
  on public.contact_requests for all to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

create policy "L’administrateur consulte les visites"
  on public.website_visits for select to authenticated
  using ((select public.is_portfolio_admin()));

create policy "L’administrateur gère les projets"
  on public.projects for all to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

create policy "L’administrateur gère les services"
  on public.services for all to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

revoke execute on function public.get_public_visit_stats() from anon;
grant execute on function public.get_public_visit_stats() to authenticated;
