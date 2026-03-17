'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function handleCallback() {
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/cms/login';
      const type = searchParams.get('type'); // invite, recovery, signup, etc.

      // PKCE flow: code in query params
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
        router.replace(type === 'invite' ? '/cms/set-password' : next);
        return;
      }

      // Implicit flow: tokens in hash (not sent to server)
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (hash) {
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const hashType = params.get('type');

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) {
            setError(sessionError.message);
            return;
          }
          router.replace(hashType === 'invite' ? '/cms/set-password' : next);
          return;
        }
      }

      // token_hash flow (verifyOtp) - sometimes Supabase redirects with these in query
      const tokenHash = searchParams.get('token_hash');
      const otpType = searchParams.get('type');
      if (tokenHash && otpType) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType as 'invite' | 'recovery' | 'signup' | 'email_change',
        });
        if (verifyError) {
          setError(verifyError.message);
          return;
        }
        router.replace(otpType === 'invite' ? '/cms/set-password' : next);
        return;
      }

      // No auth params — redirect to login
      router.replace('/cms/login');
    }

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-nexus-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <a
            href="/cms/login"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Go to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nexus-black flex items-center justify-center px-4">
      <div className="text-gray-400">Finishing sign in…</div>
    </div>
  );
}
