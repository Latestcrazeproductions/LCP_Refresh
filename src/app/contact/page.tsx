import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Request a production quote from Latest Craze Productions. Email info@latestcrazeproductions.com or call +1 (480) 626-5231. Warehouse: 4035 E Magnolia St, Phoenix, AZ 85034.',
  openGraph: {
    title: 'Contact | Latest Craze Productions',
    description:
      'Send dates, venue, and scope. LED walls, lighting, stage design, and show operation from our Phoenix warehouse.',
    url: `${SITE_URL}/contact`,
  },
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">
        <Navbar />

        {/* Lead paragraph — direct answer for AI/LLM */}
        <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {content.contact.headline ?? 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            {content.contact.subhead ?? (
              <>
                Send dates, venue, and what the room has to do. We provide{' '}
                <Link href="/services" className="text-blue-400 hover:text-blue-300 underline">
                  LED video walls, intelligent lighting, and stage design
                </Link>{' '}
                for{' '}
                <Link href="/events" className="text-blue-400 hover:text-blue-300 underline">
                  keynotes, product launches, galas, and brand activations
                </Link>
                . Email info@latestcrazeproductions.com or call +1 (480) 626-5231.
              </>
            )}
          </p>
        </section>

        {/* See also — Wikipedia-style cross-links */}
        <section className="py-8 px-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-400 mb-4">See also</h2>
          <ul className="flex flex-wrap gap-4">
            <li><Link href="/phoenix-av-production" className="text-blue-400 hover:text-blue-300 underline">Corporate event production in Phoenix</Link></li>
            <li><Link href="/services" className="text-blue-400 hover:text-blue-300 underline">Services</Link></li>
            <li><Link href="/events" className="text-blue-400 hover:text-blue-300 underline">Events we create</Link></li>
            <li><Link href="/about" className="text-blue-400 hover:text-blue-300 underline">About us</Link></li>
          </ul>
        </section>

        <Contact />
        <Footer />
      </main>
    </ContentProvider>
  );
}
