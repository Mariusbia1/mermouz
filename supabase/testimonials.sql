create extension if not exists "pgcrypto";

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  source text not null default 'ComeUp',
  service text not null,
  quote text not null,
  rating smallint check (rating between 1 and 5),
  review_date date,
  screenshot_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Les témoignages publiés sont visibles" on public.testimonials;
drop policy if exists "L’administrateur gère les témoignages" on public.testimonials;

create policy "Les témoignages publiés sont visibles"
  on public.testimonials for select to anon, authenticated
  using (is_published = true or (select public.is_portfolio_admin()));

create policy "L’administrateur gère les témoignages"
  on public.testimonials for all to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

create index if not exists testimonials_public_order_idx
  on public.testimonials (is_published, display_order);

insert into public.testimonials (
  id, client_name, source, service, quote, rating, review_date,
  screenshot_url, is_featured, is_published, display_order
)
values
  (
    '00000000-0000-4000-8000-000000000001', 'KeurtysG', 'ComeUp',
    'Collaboration web',
    'Très satisfaisant. Ce n’est que le début d’une longue collaboration. Je recommande.',
    5, '2026-02-19', '/testimonials/keurtysg-19-fevrier.png', true, true, 1
  ),
  (
    '00000000-0000-4000-8000-000000000002', 'KeurtysG', 'ComeUp',
    'Collaboration web',
    'Ce n’est que le début de notre collaboration. Parfait, rien à dire.',
    5, '2026-02-08', '/testimonials/keurtysg-8-fevrier.png', true, true, 2
  ),
  (
    '00000000-0000-4000-8000-000000000003', 'Client ComeUp', 'ComeUp',
    'Prestation web',
    'Merci, rapide, à l’écoute et m’a même offert un service.',
    5, '2025-10-09', '/testimonials/comeup-octobre.png', true, true, 3
  ),
  (
    '00000000-0000-4000-8000-000000000004', 'typo75', 'ComeUp',
    'Livraison web', 'Merci beaucoup.', 5, null,
    '/testimonials/typo75.png', false, true, 4
  ),
  (
    '00000000-0000-4000-8000-000000000005', 'Client confidentiel', 'WhatsApp',
    'Projet web',
    'Déjà bravo. J’ai vu ce qui a été fait et j’avoue que c’est bien.',
    null, null, '/testimonials/whatsapp-client.png', false, true, 5
  )
on conflict (id) do nothing;
