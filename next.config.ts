import type { NextConfig } from 'next';
import { legacyRedirects } from './legacy-redirects';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : null;
// Fallback matches .env.example — ensures images work even if env not set at build
const supabaseHostFallback = 'qsccsddknmvidvcfpffu.supabase.co';

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects;
  },
  async rewrites() {
    return [{ source: '/sitemap.xml', destination: '/api/sitemap-xml' }];
  },
  env: {
    NEXT_PUBLIC_SEMRUSH_API_URL: process.env.NEXT_PUBLIC_SEMRUSH_API_URL || 'http://localhost:6000',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      // Supabase storage — allow both env-derived host and fallback for Vercel builds
      ...(supabaseHost
        ? [
            { protocol: 'https' as const, hostname: supabaseHost, pathname: '/storage/v1/object/public/**' },
            { protocol: 'https' as const, hostname: supabaseHost, pathname: '/storage/v1/render/image/public/**' },
          ]
        : []),
      {
        protocol: 'https',
        hostname: supabaseHostFallback,
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: supabaseHostFallback,
        pathname: '/storage/v1/render/image/public/**',
      },
    ],
  },
};

export default nextConfig;
