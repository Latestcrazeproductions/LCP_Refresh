-- Contact form submissions table
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  project_details text,
  created_at timestamptz not null default now()
);

-- RLS: anyone can insert (form is public); only authenticated can read
alter table public.contact_submissions enable row level security;

create policy "Anyone can submit contact form"
  on public.contact_submissions for insert
  with check (true);

create policy "Authenticated users can read submissions"
  on public.contact_submissions for select
  to authenticated
  using (true);
