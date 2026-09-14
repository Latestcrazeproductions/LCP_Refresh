'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { CONSENT_CHANGE_EVENT, readConsent, type ConsentState } from '@/lib/consent';
import { analyticsAllowed, applyGoogleConsent, trackPageView } from '@/lib/ga';

export default function GaPageViews() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const existing = readConsent();
    if (existing) applyGoogleConsent(existing);

    function onChange(event: Event) {
      const state = (event as CustomEvent<ConsentState>).detail;
      if (!state) return;
      applyGoogleConsent(state);
      if (state.analytics) {
        const path = window.location.pathname;
        trackPageView(path);
        lastPath.current = path;
      }
    }

    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (!analyticsAllowed()) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
