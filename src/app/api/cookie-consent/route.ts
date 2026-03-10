import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Simple hash for anonymization (non-crypto, sufficient for deduplication)
function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h).toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      visitor_id,
      session_id,
      essential,
      analytics,
      marketing,
      preferences,
      consent_method,
      policy_version = '1.0',
      email,
      referrer_domain,
      first_page,
    } = body;

    if (!visitor_id || !consent_method) {
      return NextResponse.json(
        { error: 'visitor_id and consent_method are required' },
        { status: 400 }
      );
    }

    // Anonymize IP (never store raw IP)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown';
    const ip_hash = simpleHash(ip);

    // Anonymize user agent
    const ua = request.headers.get('user-agent') ?? '';
    const user_agent_hash = simpleHash(ua.substring(0, 200));

    // Geo from Vercel/Cloudflare (if available)
    const country_code = request.headers.get('x-vercel-ip-country')
      ?? request.headers.get('cf-ipcountry')
      ?? null;
    const region = request.headers.get('x-vercel-ip-country-region') ?? null;

    const supabase = await createClient();
    const { error } = await supabase.from('cookie_consents').insert({
      visitor_id: String(visitor_id).slice(0, 64),
      session_id: session_id ? String(session_id).slice(0, 64) : null,
      essential: Boolean(essential ?? true),
      analytics: Boolean(analytics ?? false),
      marketing: Boolean(marketing ?? false),
      preferences: Boolean(preferences ?? false),
      consent_method: String(consent_method),
      policy_version: String(policy_version),
      email: email ? String(email).trim().slice(0, 255) : null,
      ip_hash,
      country_code,
      region,
      user_agent_hash,
      referrer_domain: referrer_domain ? String(referrer_domain).slice(0, 255) : null,
      first_page: first_page ? String(first_page).slice(0, 512) : null,
    });

    if (error) {
      console.error('Cookie consent insert error:', error);
      return NextResponse.json({ error: 'Failed to save consent' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cookie consent API error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
