import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar from '@/components/Navbar';
import ContactCta from '@/components/ContactCta';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Digital Signage',
  description:
    'Corporate digital signage and LED content for lobbies, breakout areas, and event campuses — from wayfinding to sponsor loops and keynote support.',
  openGraph: {
    title: 'Digital Signage | Latest Craze Productions',
    description:
      'LED and digital signage for corporate events: content pipelines, scheduling, and on-site operation.',
    url: `${SITE_URL}/digital-signage`,
  },
  alternates: { canonical: `${SITE_URL}/digital-signage` },
};

export default async function DigitalSignagePage() {
  const content = await getSiteContent();

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">
        <Navbar />
        <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Digital Signage</h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            Extend your brand beyond the main stage with coordinated digital signage—lobbies,
            registration, breakout corridors, and sponsor moments. We align resolution, color, and
            playback with your LED and projection systems so every screen feels intentional.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mb-10">
            Pair signage with our{' '}
            <Link href="/services/led-walls" className="text-blue-400 hover:text-blue-300 underline">
              ultra-wide LED
            </Link>{' '}
            and{' '}
            <Link href="/services/projection" className="text-blue-400 hover:text-blue-300 underline">
              projection
            </Link>{' '}
            offerings for a single creative thread across the venue.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Talk to us about signage
          </Link>
        </section>
        <ContactCta content={content} />
        <Footer />
      </main>
    </ContentProvider>
  );
}
