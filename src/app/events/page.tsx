import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Events We Create',
  description:
    'Latest Craze Productions creates corporate keynotes, product launches, galas, conferences, and brand activations. Immersive event production with LED walls, lighting, and stage design.',
  openGraph: {
    title: 'Events We Create | Latest Craze Productions',
    description:
      'Corporate keynotes, product launches, galas, conferences, and brand activations with cinematic production value.',
    url: `${SITE_URL}/events`,
  },
  alternates: { canonical: `${SITE_URL}/events` },
};

export default async function EventsPage() {
  const content = await getSiteContent();
  const eventTypes = Array.isArray(content?.eventTypes?.items) ? content.eventTypes.items : [];

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">
        <Navbar />

        {/* Lead paragraph — direct answer for AI/LLM */}
        <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Events We Create
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Latest Craze Productions produces high-impact corporate events across the United States. From executive keynotes and product launches to galas, conferences, and brand activations, we combine <Link href="/services" className="text-blue-400 hover:text-blue-300 underline">LED video walls, intelligent lighting, and stage design</Link> to create moments that define careers and brands. <Link href="/about" className="text-blue-400 hover:text-blue-300 underline">Learn more about us</Link> or <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">contact us</Link> to discuss your next event.
          </p>
        </section>

        {/* Event types with H2/H3 hierarchy */}
        <section className="py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
          <h2 className="text-3xl font-bold mb-12">{content?.eventTypes?.sectionTitle ?? 'Events We Create'}</h2>

          <div className="space-y-12">
            {eventTypes.map((eventType) => (
              <article key={eventType.id} className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-64 h-48 md:h-36 shrink-0 rounded-lg overflow-hidden">
                  {eventType.image ? (
                    <Image
                      src={eventType.image}
                      alt={eventType.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 256px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{eventType.title}</h3>
                  <p className="text-gray-400">{eventType.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* See also — Wikipedia-style cross-links */}
        <section className="py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
          <h2 className="text-xl font-semibold text-gray-400 mb-4">See also</h2>
          <ul className="flex flex-wrap gap-4">
            <li><Link href="/services" className="text-blue-400 hover:text-blue-300 underline">Event production services</Link></li>
            <li><Link href="/about" className="text-blue-400 hover:text-blue-300 underline">About Latest Craze Productions</Link></li>
            <li><Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact us</Link></li>
          </ul>
        </section>

        <Contact />
        <Footer />
      </main>
    </ContentProvider>
  );
}
