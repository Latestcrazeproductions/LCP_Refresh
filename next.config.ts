import type { NextConfig } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : 'fvlslawwabinwzgraoor.supabase.co';

const nextConfig: NextConfig = {
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
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/render/image/public/**',
      },
    ],
  },
};

export default nextConfig;
