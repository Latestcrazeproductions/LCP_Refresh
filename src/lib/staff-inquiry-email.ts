import type { SiteContent } from './content';

export type InquiryFields = {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  venue?: string | null;
  eventLocation?: string | null;
  eventType?: string | null;
  eventDate?: string | null;
  attendeeCount?: string | null;
  timeline?: string | null;
  referralSource?: string | null;
  projectDetails?: string | null;
};

function line(label: string, value: string | null | undefined): string | null {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }
  return `${label}: ${String(value).trim()}`;
}

/**
 * Plain-text staff notification so replies and threads look like normal email
 * (no branded HTML template — that is reserved for the customer thank-you).
 */
export function buildStaffInquiryEmailText(
  content: SiteContent,
  fields: InquiryFields
): string {
  const brand = content.brand.nameFull;
  const header = [
    `New contact inquiry — ${brand}`,
    '',
    'Reply to this message to reach the submitter (Reply-To is set to their address).',
    '',
  ];

  const bodyLines = [
    line('Name', fields.name),
    line('Email', fields.email),
    line('Company', fields.company),
    line('Phone', fields.phone),
    line('Venue', fields.venue),
    line('Event location', fields.eventLocation),
    line('Event type', fields.eventType),
    line('Event date', fields.eventDate),
    line('Attendees', fields.attendeeCount),
    line('Timeline', fields.timeline),
    line('Referral', fields.referralSource),
  ].filter((l): l is string => l != null);

  if (fields.projectDetails && String(fields.projectDetails).trim()) {
    bodyLines.push(
      '',
      'Project details:',
      String(fields.projectDetails).trim()
    );
  }

  if (bodyLines.length === 0) {
    bodyLines.push('(No details provided.)');
  }

  return [...header, ...bodyLines].join('\n');
}
