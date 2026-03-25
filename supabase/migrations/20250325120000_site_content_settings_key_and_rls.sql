-- Allow `settings` key for CMS (staff inquiry emails, toggles).
-- Hide `settings` from anonymous/public SELECT so staff addresses are not exposed via the anon key.

alter table public.site_content drop constraint if exists site_content_key_check;

alter table public.site_content
  add constraint site_content_key_check
  check (
    key in (
      'brand',
      'hero',
      'featuredVideo',
      'work',
      'services',
      'eventTypes',
      'faq',
      'contact',
      'settings'
    )
  );

drop policy if exists "Public read access for site content" on public.site_content;
drop policy if exists "Anonymous can read site content for public pages" on public.site_content;
drop policy if exists "Public read site content except settings" on public.site_content;
drop policy if exists "Authenticated read all site content including settings" on public.site_content;

create policy "Public read site content except settings"
  on public.site_content
  for select
  using (key <> 'settings');

create policy "Authenticated read all site content including settings"
  on public.site_content
  for select
  to authenticated
  using (true);
