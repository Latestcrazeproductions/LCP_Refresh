import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import DeferredCookieConsent from '@/components/DeferredCookieConsent';
import AuthHashHandler from '@/components/AuthHashHandler';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
};

export const metadata: Metadata = {
  title: {
    default: 'Latest Craze Productions | Immersive Live Event Production',
    template: '%s | Latest Craze Productions',
  },
  description:
    'We engineer 40ft video walls and lighting experiences that define moments. Ultra-wide LED displays, intelligent lighting, stage design, and precision audio for corporate events.',
  keywords: [
    'event production',
    'LED video walls',
    'corporate events',
    'live events',
    'lighting design',
    'AV production',
    'Phoenix',
    'Latest Craze Productions',
  ],
  authors: [{ name: 'Latest Craze Productions' }],
  creator: 'Latest Craze Productions',
  publisher: 'Latest Craze Productions',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Latest Craze Productions',
    title: 'Latest Craze Productions | Immersive Live Event Production',
    description:
      'We engineer 40ft video walls and lighting experiences that define moments.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Latest Craze Productions - The Future of Live Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Craze Productions | Immersive Live Event Production',
    description:
      'We engineer 40ft video walls and lighting experiences that define moments.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body
        className="antialiased"
        style={{
          backgroundColor: '#050505',
          color: 'white',
          fontFamily: 'var(--font-sans), Inter, system-ui, sans-serif',
        }}
      >
        {children}
        <AuthHashHandler />
        <DeferredCookieConsent />
      </body>
    </html>
  );
}
