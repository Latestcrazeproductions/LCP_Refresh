import type { SiteContent } from './content';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

function row(label: string, value: string | null | undefined): string {
  if (value === null || value === undefined || String(value).trim() === '') {
    return '';
  }
  const v = escapeHtml(String(value).trim());
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #27272a;color:#a1a1aa;width:160px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #27272a;color:#fafafa;">${v}</td></tr>`;
}

/** Staff notification for a new contact form submission. */
export function buildStaffInquiryEmailHtml(
  content: SiteContent,
  fields: InquiryFields
): string {
  const brand = escapeHtml(content.brand.nameFull);
  const rows =
    row('Name', fields.name) +
    row('Email', fields.email) +
    row('Company', fields.company) +
    row('Phone', fields.phone) +
    row('Venue', fields.venue) +
    row('Event location', fields.eventLocation) +
    row('Event type', fields.eventType) +
    row('Event date', fields.eventDate) +
    row('Attendees', fields.attendeeCount) +
    row('Timeline', fields.timeline) +
    row('Referral', fields.referralSource) +
    row('Project details', fields.projectDetails);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New contact inquiry</title>
</head>
<body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#09090b;color:#fafafa;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#09090b;">
    <tr>
      <td style="padding:32px 16px;">
        <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#18181b;border-radius:12px;border:1px solid #27272a;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;border-bottom:1px solid #27272a;">
              <h1 style="margin:0;font-size:18px;font-weight:600;color:#fafafa;">New contact inquiry — ${brand}</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#a1a1aa;">Reply to this email to reach the submitter (Reply-To is set to their address).</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                ${rows || '<tr><td style="padding:16px 24px;color:#a1a1aa;">No details provided.</td></tr>'}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
