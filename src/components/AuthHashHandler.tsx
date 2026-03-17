'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Handles auth tokens in the URL hash when Supabase redirects to the Site URL
 * (root or any page) instead of /auth/callback. Processes access_token/refresh_token
 * and redirects to set-password (invite) or login.
 */
export default function AuthHashHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash?.replace(/^#/, '');
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    if (!accessToken || !refreshToken) return;

    const supabase = createClient();
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) return;
        // Replace URL to remove tokens from address bar, then navigate
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        router.replace(type === 'invite' ? '/cms/set-password' : '/cms/login');
      });
  }, [router, pathname]);

  return null;
}
