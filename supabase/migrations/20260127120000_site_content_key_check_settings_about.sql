-- Ensure site_content allows `settings` (CMS Settings / staff emails) and `about` (matches src/app/cms/actions.ts CMS_KEYS).
-- Safe to re-run: replaces the check constraint with the full key list.
-- Also ensures RLS hides `settings` from anonymous reads (staff email addresses).

alter table public.site_content drop constraint if exists site_content_key_check;

alter table public.site_content
  add constraint site_content_key_check
  check (
    key in (
      'brand',
      'hero',
      'about',
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
