import { readConsent, type ConsentState } from '@/lib/consent';

const DEFAULT_GA_MEASUREMENT_ID = 'G-W2K2ZKCHVZ';

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || DEFAULT_GA_MEASUREMENT_ID;

export function isGaMeasurementId(id: string): boolean {
  return /^G-[A-Z0-9]+$/i.test(id);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  window.gtag?.(...args);
}

/** Analytics is on unless the visitor explicitly opted out (Reject / Customize). */
export function analyticsAllowed(): boolean {
  const consent = readConsent();
  if (!consent) return true;
  return consent.analytics;
}

export function applyGoogleConsent(state: Pick<ConsentState, 'analytics' | 'marketing'>) {
  gtag('consent', 'update', {
    analytics_storage: state.analytics ? 'granted' : 'denied',
    ad_storage: state.marketing ? 'granted' : 'denied',
    ad_user_data: state.marketing ? 'granted' : 'denied',
    ad_personalization: state.marketing ? 'granted' : 'denied',
  });
}

export function trackPageView(path: string) {
  if (!analyticsAllowed()) return;
  gtag('event', 'page_view', {
    page_path: path,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
  });
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (!analyticsAllowed()) return;
  gtag('event', name, params);
}
