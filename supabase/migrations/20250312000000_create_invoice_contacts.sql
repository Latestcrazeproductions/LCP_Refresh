-- Invoice contacts: synced from LASSO or imported for searchable dropdown in Invoice Request Form
create table if not exists public.invoice_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invoice_contacts_name_lower on public.invoice_contacts (lower(name));
create index if not exists idx_invoice_contacts_email_lower on public.invoice_contacts (lower(email));

alter table public.invoice_contacts enable row level security;

-- Only authenticated users (CMS) can read
create policy "Authenticated users can read invoice contacts"
  on public.invoice_contacts for select
  to authenticated
  using (true);

-- Authenticated users can manage (for future CMS contact management)
create policy "Authenticated users can insert invoice contacts"
  on public.invoice_contacts for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update invoice contacts"
  on public.invoice_contacts for update
  to authenticated
  using (true);

create policy "Authenticated users can delete invoice contacts"
  on public.invoice_contacts for delete
  to authenticated
  using (true);
