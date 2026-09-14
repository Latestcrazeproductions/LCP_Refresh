export const CONSENT_COOKIE = 'lcp_consent';
export const VISITOR_COOKIE = 'lcp_visitor';
export const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
export const CONSENT_CHANGE_EVENT = 'lcp-consent-change';

export type ConsentState = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  ts: number;
};

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function parseConsentCookie(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed && typeof parsed.ts === 'number') return parsed;
  } catch {
    return null;
  }
  return null;
}

export function readConsent(): ConsentState | null {
  return parseConsentCookie(getCookie(CONSENT_COOKIE));
}

export function dispatchConsentChange(state: ConsentState) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: state }));
}
