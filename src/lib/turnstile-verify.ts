import type { NextRequest } from 'next/server';

type SiteverifyJson = {
  success: boolean;
  'error-codes'?: string[];
};

function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? null;
  }
  return request.headers.get('x-real-ip');
}

/**
 * When TURNSTILE_SECRET_KEY is set, requires a valid token from the client widget.
 * If the secret is unset (local dev), verification is skipped so the form still works.
 */
export async function verifyTurnstileIfConfigured(
  token: unknown,
  request: NextRequest
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: true };
  }

  if (typeof token !== 'string' || !token.trim()) {
    return { ok: false, error: 'Security verification required. Please try again.' };
  }

  const params = new URLSearchParams();
  params.set('secret', secret);
  params.set('response', token.trim());
  const ip = clientIp(request);
  if (ip) {
    params.set('remoteip', ip);
  }

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  let data: SiteverifyJson;
  try {
    data = (await res.json()) as SiteverifyJson;
  } catch {
    return { ok: false, error: 'Security verification failed. Please try again.' };
  }

  if (!data.success) {
    console.warn('[turnstile] siteverify failed', data['error-codes'] ?? []);
    return { ok: false, error: 'Security verification failed. Please try again.' };
  }

  return { ok: true };
}
