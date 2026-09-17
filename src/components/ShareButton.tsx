'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { trackEvent } from '@/lib/ga';

type ShareButtonProps = {
  title: string;
  text?: string;
  url: string;
};

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const payload = { title, text: text || title, url };
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share(payload);
        trackEvent('share', { method: 'web_share', content_type: 'article' });
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent('share', { method: 'clipboard', content_type: 'article' });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can fail without a secure context; leave the control in place.
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className="inline-flex items-center gap-2 rounded-lg border border-white/80 bg-white/15 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label={`Share ${title}`}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      <span>{copied ? 'Link copied' : 'Share'}</span>
    </button>
  );
}
