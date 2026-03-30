import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar from '@/components/Navbar';
import ContactCta from '@/components/ContactCta';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Featured Venues',
  description:
    'Corporate event production at premier Phoenix and nationwide venues — LED walls, lighting, and staging tailored to ballrooms, convention centers, and unique spaces.',
  openGraph: {
    title: 'Featured Venues | Latest Craze Productions',
    description:
      'Event production expertise for top-tier venues: scalable AV, LED, and lighting for corporate keynotes, galas, and launches.',
    url: `${SITE_URL}/featured-venues`,
  },
  alternates: { canonical: `${SITE_URL}/featured-venues` },
};

export default async function FeaturedVenuesPage() {
  const content = await getSiteContent();

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">
        <Navbar />
        <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Featured Venues</h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-6">
            We partner with leading hotels, convention centers, and unique spaces across Phoenix and
            nationwide. From intimate boardrooms to 40ft LED canvases in the main ballroom, we scale
            production to the room—power, rigging, sightlines, and broadcast-ready looks included.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mb-10">
            Tell us your venue and date; we&apos;ll align technical design with house rules, load-in
            schedules, and your creative goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Plan your venue production
          </Link>
        </section>
        <ContactCta content={content} />
        <Footer />
      </main>
    </ContentProvider>
  );
}
