-- Create site-assets storage bucket for CMS image uploads and form attachments
-- Run via: supabase db push (or apply in SQL Editor)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "Authenticated users can upload to site-assets"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'site-assets');

-- Allow authenticated users to update/delete their uploads (for CMS replace/remove)
create policy "Authenticated users can update site-assets"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'site-assets');

create policy "Authenticated users can delete from site-assets"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'site-assets');
