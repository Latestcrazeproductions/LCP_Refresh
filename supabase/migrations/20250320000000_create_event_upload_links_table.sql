-- Create event_upload_links table to map short tokens to event folder paths
drop table if exists event_upload_links;

create table if not exists event_upload_links (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  event_id text not null,
  folder text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  active boolean not null default true
);

create index if not exists idx_event_upload_links_token on event_upload_links(token);
create index if not exists idx_event_upload_links_event_id on event_upload_links(event_id);
