import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { DEFAULT_OG_IMAGE, SITE_URL, twitterLargeImageFields } from '@/lib/article-metadata';

const title = 'Request a Production Quote';
const description =
  'Request a production quote from Latest Craze Productions. Send dates, venue, attendee count, and what the room has to do. LED walls, lighting, stage, and show operation from our Phoenix warehouse.';
const og = twitterLargeImageFields(title, description, DEFAULT_OG_IMAGE.url);

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    ...og.openGraph,
    url: `${SITE_URL}/contact`,
  },
  twitter: og.twitter,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">
        <Navbar />

        <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
            Quote request
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Request a production quote
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Send dates, venue, attendee count, and what the room has to do. We quote{' '}
            <Link href="/services" className="text-blue-400 hover:text-blue-300 underline">
              LED video walls, intelligent lighting, and stage design
            </Link>{' '}
            for{' '}
            <Link href="/events" className="text-blue-400 hover:text-blue-300 underline">
              keynotes, product launches, galas, and brand activations
            </Link>
            — Phoenix warehouse, crews that travel. Email info@latestcrazeproductions.com or call +1
            (480) 626-5231.
          </p>
        </section>

        <section className="py-8 px-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-400 mb-4">See also</h2>
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="/phoenix-av-production" className="text-blue-400 hover:text-blue-300 underline">
                Corporate event production in Phoenix
              </Link>
            </li>
            <li>
              <Link href="/work" className="text-blue-400 hover:text-blue-300 underline">
                Case studies
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-blue-400 hover:text-blue-300 underline">
                Services
              </Link>
            </li>
            <li>
              <Link href="/events" className="text-blue-400 hover:text-blue-300 underline">
                Events we create
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-blue-400 hover:text-blue-300 underline">
                About us
              </Link>
            </li>
          </ul>
        </section>

        <Contact />
        <Footer />
      </main>
    </ContentProvider>
  );
}
