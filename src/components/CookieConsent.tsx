'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_COOKIE = 'lcp_consent';
const VISITOR_COOKIE = 'lcp_visitor';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

type ConsentState = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  ts: number;
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAge: number = COOKIE_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function randomId(): string {
  return crypto.randomUUID?.() ?? `v-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [custom, setCustom] = useState({ analytics: true, marketing: false, preferences: true });
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  useEffect(() => {
    const consentStr = getCookie(CONSENT_COOKIE);
    if (!consentStr) {
      setIsVisible(true);
      return;
    }
    try {
      const parsed = JSON.parse(consentStr) as ConsentState;
      if (parsed && typeof parsed.ts === 'number') {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  async function saveConsent(
    essential: boolean,
    analytics: boolean,
    marketing: boolean,
    preferences: boolean,
    method: string,
    leadEmail?: string
  ) {
    let visitorId = getCookie(VISITOR_COOKIE);
    if (!visitorId) {
      visitorId = randomId();
      setCookie(VISITOR_COOKIE, visitorId);
    }
    const sessionId = randomId();

    const payload = {
      visitor_id: visitorId,
      session_id: sessionId,
      essential,
      analytics,
      marketing,
      preferences,
      consent_method: method,
      policy_version: '1.0',
      email: leadEmail || null,
      referrer_domain: typeof document !== 'undefined' && document.referrer ? new URL(document.referrer).hostname : null,
      first_page: typeof window !== 'undefined' ? window.location.pathname || '/' : '/',
    };

    await fetch('/api/cookie-consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const state: ConsentState = { essential, analytics, marketing, preferences, ts: Date.now() };
    setCookie(CONSENT_COOKIE, JSON.stringify(state));
    setIsVisible(false);
    setIsCustomizing(false);
  }

  function handleAcceptAll() {
    saveConsent(true, true, true, true, 'accept_all');
  }

  function handleRejectNonEssential() {
    saveConsent(true, false, false, false, 'reject_non_essential');
  }

  function handleSaveCustomize() {
    saveConsent(true, custom.analytics, custom.marketing, custom.preferences, 'customize');
  }

  function handleAcceptAllWithEmail() {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      saveConsent(true, true, true, true, 'accept_all', email);
    } else {
      handleAcceptAll();
    }
    setShowEmailCapture(false);
  }

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 bg-black/95 border-t border-white/10 backdrop-blur-sm"
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-desc"
    >
      <div className="max-w-4xl mx-auto">
        {!isCustomizing ? (
          <>
            <p id="cookie-consent-desc" className="text-gray-300 text-sm md:text-base mb-4">
              We use cookies to improve your experience, analyze traffic, and support marketing. Essential cookies are required. You can accept all, reject non-essential, or customize. By opting into marketing, you consent to us using your data for business growth. See our{' '}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </Link>.
            </p>

            {showEmailCapture ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter email for updates (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAcceptAllWithEmail}
                    className="px-4 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Accept &amp; Subscribe
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailCapture(false)}
                    className="px-4 py-2.5 text-gray-400 hover:text-white text-sm"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailCapture(true)}
                  className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors text-sm"
                >
                  Accept &amp; Get Updates
                </button>
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="px-4 py-2.5 text-gray-400 hover:text-white transition-colors text-sm border border-white/20 rounded-lg"
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomizing(true)}
                  className="px-4 py-2.5 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Customize
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-gray-300 text-sm mb-4">Choose your cookie preferences:</p>
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-24">Essential</span>
                <span className="text-gray-500 text-xs">Required for the site to work</span>
                <input type="checkbox" checked disabled className="rounded" />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-gray-400 text-sm w-24">Analytics</span>
                <span className="text-gray-500 text-xs">Help us improve the site</span>
                <input
                  type="checkbox"
                  checked={custom.analytics}
                  onChange={(e) => setCustom((c) => ({ ...c, analytics: e.target.checked }))}
                  className="rounded"
                />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-gray-400 text-sm w-24">Marketing</span>
                <span className="text-gray-500 text-xs">Personalized ads &amp; outreach</span>
                <input
                  type="checkbox"
                  checked={custom.marketing}
                  onChange={(e) => setCustom((c) => ({ ...c, marketing: e.target.checked }))}
                  className="rounded"
                />
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-gray-400 text-sm w-24">Preferences</span>
                <span className="text-gray-500 text-xs">Remember your choices</span>
                <input
                  type="checkbox"
                  checked={custom.preferences}
                  onChange={(e) => setCustom((c) => ({ ...c, preferences: e.target.checked }))}
                  className="rounded"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveCustomize}
                className="px-4 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="px-4 py-2.5 text-gray-400 hover:text-white text-sm"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
