-- Add eventTypes to allowed site_content keys
-- Drop by name first (idempotent — safe to run multiple times)
alter table public.site_content drop constraint if exists site_content_key_check;

alter table public.site_content
  add constraint site_content_key_check
  check (key in ('brand', 'hero', 'work', 'services', 'eventTypes', 'contact'));
