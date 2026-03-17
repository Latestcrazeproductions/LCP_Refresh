'use client';

import { useEffect, useState } from 'react';
import CookieConsent from '@/components/CookieConsent';

export default function DeferredCookieConsent() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isReady) {
    return null;
  }

  return <CookieConsent />;
}
