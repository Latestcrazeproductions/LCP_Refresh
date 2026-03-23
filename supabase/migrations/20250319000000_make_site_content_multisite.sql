-- Migration to add site_id to site_content and make it multi-site aware
-- Date: 2025-03-19

-- 1. Add site_id column
alter table public.site_content add column if not exists site_id text default 'latest-craze';

-- 2. Update existing rows to have the default site_id (if they don't already)
update public.site_content set site_id = 'latest-craze' where site_id is null;

-- 3. Drop existing primary key and add new composite primary key
-- Note: We need to find the PK name if it's not the default
do $$
declare
    pk_name text;
begin
    select constraint_name into pk_name
    from information_schema.table_constraints
    where table_name = 'site_content' and constraint_type = 'PRIMARY KEY';

    if pk_name is not null then
        execute 'alter table public.site_content drop constraint ' || pk_name;
    end if;
end $$;

alter table public.site_content add primary key (site_id, key);

-- 4. Update RLS policies to be site-aware (optional but recommended for the future)
-- For now, we'll keep the existing "allow all authenticated" policy, 
-- but in a real multi-tenant setup, we'd filter by site_id.

-- 5. Add index for faster site-based lookups
create index if not exists idx_site_content_site_id on public.site_content(site_id);
