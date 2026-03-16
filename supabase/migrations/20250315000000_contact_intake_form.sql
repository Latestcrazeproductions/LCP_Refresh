-- Add intake form columns to contact_submissions for event inquiry context

alter table public.contact_submissions
  add column if not exists phone text,
  add column if not exists event_location text,
  add column if not exists event_type text,
  add column if not exists event_date text,
  add column if not exists attendee_count text,
  add column if not exists referral_source text,
  add column if not exists timeline text;

comment on column public.contact_submissions.phone is 'Contact phone number';
comment on column public.contact_submissions.event_location is 'City, state, or venue name';
comment on column public.contact_submissions.event_type is 'Keynote, Conference, etc.';
comment on column public.contact_submissions.event_date is 'Expected or approximate event date';
comment on column public.contact_submissions.attendee_count is 'Approximate attendee range';
comment on column public.contact_submissions.referral_source is 'How they heard about us';
comment on column public.contact_submissions.timeline is 'Lead time / urgency';
