-- Site content table: key-value store for CMS sections
create table if not exists public.site_content (
  key text primary key check (key in ('brand', 'hero', 'work', 'services', 'contact')),
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- RLS: anyone can read (public site); only authenticated can write
alter table public.site_content enable row level security;

drop policy if exists "Public read access for site content" on public.site_content;
create policy "Public read access for site content"
  on public.site_content for select
  using (true);

drop policy if exists "Authenticated users can update site content" on public.site_content;
create policy "Authenticated users can update site content"
  on public.site_content for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can insert site content" on public.site_content;
create policy "Authenticated users can insert site content"
  on public.site_content for insert
  to authenticated
  with check (true);

drop policy if exists "Anonymous can read site content for public pages" on public.site_content;
create policy "Anonymous can read site content for public pages"
  on public.site_content for select
  to anon
  using (true);
