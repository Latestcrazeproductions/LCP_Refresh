/** CMS app settings stored under site_content key `settings` (not merged into public SiteContent). */

export const SITE_CONTENT_SITE_ID =
  process.env.NEXT_PUBLIC_SITE_CONTENT_SITE_ID ?? 'latest-craze';

export const STAFF_EMAIL_DOMAIN = '@latestcrazeproductions.com';

export type CmsAppSettings = {
  staffInquiryEmails: string[];
  sendThankYouEmail: boolean;
};

export function defaultCmsAppSettings(): CmsAppSettings {
  return { staffInquiryEmails: [], sendThankYouEmail: true };
}

export function isAllowedStaffEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  return e.endsWith(STAFF_EMAIL_DOMAIN) && e.length > STAFF_EMAIL_DOMAIN.length;
}

/** Normalize and dedupe; drops invalid addresses. */
export function normalizeCmsAppSettings(value: unknown): CmsAppSettings {
  const d = defaultCmsAppSettings();
  if (!value || typeof value !== 'object') return d;
  const v = value as Record<string, unknown>;
  if (Array.isArray(v.staffInquiryEmails)) {
    const seen = new Set<string>();
    for (const raw of v.staffInquiryEmails) {
      const e = String(raw).trim().toLowerCase();
      if (!isAllowedStaffEmail(e) || seen.has(e)) continue;
      seen.add(e);
      d.staffInquiryEmails.push(e);
    }
  }
  if (typeof v.sendThankYouEmail === 'boolean') {
    d.sendThankYouEmail = v.sendThankYouEmail;
  } else if (typeof v.sendThankYouEmail === 'string') {
    const s = v.sendThankYouEmail.trim().toLowerCase();
    if (s === 'true' || s === '1') d.sendThankYouEmail = true;
    if (s === 'false' || s === '0') d.sendThankYouEmail = false;
  }
  return d;
}

export type ParseSettingsResult =
  | { ok: true; value: CmsAppSettings }
  | { ok: false; error: string };

/** Server-side validation before persisting `settings` key. */
export function parseSettingsForSave(value: unknown): ParseSettingsResult {
  if (value === null || value === undefined) {
    return { ok: true, value: defaultCmsAppSettings() };
  }
  if (typeof value !== 'object') {
    return { ok: false, error: 'Settings must be an object' };
  }
  const v = value as Record<string, unknown>;
  if (
    v.sendThankYouEmail !== undefined &&
    typeof v.sendThankYouEmail !== 'boolean'
  ) {
    return { ok: false, error: 'sendThankYouEmail must be a boolean' };
  }
  if (v.staffInquiryEmails !== undefined && !Array.isArray(v.staffInquiryEmails)) {
    return { ok: false, error: 'staffInquiryEmails must be an array' };
  }
  const normalized = normalizeCmsAppSettings(value);
  if (Array.isArray(v.staffInquiryEmails)) {
    for (const raw of v.staffInquiryEmails) {
      const e = String(raw).trim().toLowerCase();
      if (e.length === 0) continue;
      if (!isAllowedStaffEmail(e)) {
        return {
          ok: false,
          error: `Invalid staff email (must end with ${STAFF_EMAIL_DOMAIN}): ${String(raw).trim()}`,
        };
      }
    }
  }
  return { ok: true, value: normalized };
}

/** Parse textarea / comma-separated input into candidate emails (trim only). */
export function parseStaffEmailInput(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
