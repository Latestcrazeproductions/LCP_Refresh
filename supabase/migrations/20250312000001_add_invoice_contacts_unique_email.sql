-- Unique email for upsert during sync (one contact per email; last write wins)
alter table public.invoice_contacts
  add constraint invoice_contacts_email_unique unique (email);
