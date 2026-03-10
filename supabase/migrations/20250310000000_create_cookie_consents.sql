-- Cookie consent and visitor data for business growth, analytics, and data monetization
-- Stores consent preferences with anonymized signals for segmentation and lead capture

create table if not exists public.cookie_consents (
  id uuid primary key default gen_random_uuid(),
  -- Anonymized visitor/session identifiers (no PII)
  visitor_id text not null,
  session_id text,
  -- Consent choices
  essential boolean not null default true,
  analytics boolean not null default false,
  marketing boolean not null default false,
  preferences boolean not null default false,
  consent_method text not null check (consent_method in ('accept_all', 'reject_non_essential', 'customize', 'banner_dismiss')),
  policy_version text not null default '1.0',
  -- Optional lead capture when marketing consented
  email text,
  -- Anonymized signals for segmentation (geo, device, referrer)
  ip_hash text,
  country_code text,
  region text,
  user_agent_hash text,
  referrer_domain text,
  first_page text,
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for analytics: consent by date, marketing opt-in, geo
create index if not exists idx_cookie_consents_created_at on public.cookie_consents (created_at desc);
create index if not exists idx_cookie_consents_marketing on public.cookie_consents (marketing) where marketing = true;
create index if not exists idx_cookie_consents_visitor on public.cookie_consents (visitor_id);
create index if not exists idx_cookie_consents_email on public.cookie_consents (email) where email is not null;
create index if not exists idx_cookie_consents_country on public.cookie_consents (country_code);

-- RLS: public insert (banner is anonymous); authenticated read for business use
alter table public.cookie_consents enable row level security;

create policy "Anyone can submit cookie consent"
  on public.cookie_consents for insert
  with check (true);

create policy "Authenticated users can read consent data"
  on public.cookie_consents for select
  to authenticated
  using (true);

create policy "Authenticated users can update consent (e.g. withdraw)"
  on public.cookie_consents for update
  to authenticated
  using (true)
  with check (true);

-- Trigger to keep updated_at fresh
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists cookie_consents_updated_at on public.cookie_consents;
create trigger cookie_consents_updated_at
  before update on public.cookie_consents
  for each row execute function public.update_updated_at();
