import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import { getServiceIcon } from '@/lib/service-icons';
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
      <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

        <Navbar />

        {/* Lead + section header — matches services page */}
        <section className="relative pt-32 pb-12 px-6 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Events We Create
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mb-16">
            Latest Craze Productions produces high-impact corporate events across the United States. From executive keynotes and product launches to galas, conferences, and brand activations, we combine <Link href="/services" className="text-blue-400 hover:text-blue-300 underline">LED video walls, intelligent lighting, and stage design</Link> to create moments that define careers and brands. <Link href="/about" className="text-blue-400 hover:text-blue-300 underline">Learn more about us</Link> or <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">contact us</Link> to discuss your next event.
          </p>

          <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{content?.eventTypes?.sectionTitle ?? 'Events We Create'}</h2>
              <p className="text-gray-400 max-w-md">{content?.eventTypes?.sectionSubhead ?? 'From high-stakes keynotes to immersive brand activations.'}</p>
            </div>
            <div className="text-right hidden md:block">
              <span className="text-xs uppercase tracking-widest text-gray-600">Event Types — {String(eventTypes.length).padStart(2, '0')}</span>
            </div>
          </div>
        </section>

        {/* Card grid — matches services page style */}
        <section className="relative py-8 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {eventTypes.map((eventType) => {
              const IconComponent = getServiceIcon(eventType.iconKey || '');
              return (
                <Link
                  key={eventType.id}
                  href={`/events/${eventType.id}`}
                  className="group relative h-[400px] rounded-2xl overflow-hidden block"
                >
                  {eventType.image ? (
                    <Image
                      src={eventType.image}
                      alt={eventType.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex justify-between items-end">
                      <div>
                        {IconComponent && (
                          <div className="mb-4 p-3 w-fit rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                            <IconComponent className="w-6 h-6" />
                          </div>
                        )}
                        <h3 className="text-3xl font-bold mb-2 text-white">{eventType.title}</h3>
                        <p className="text-gray-300 max-w-sm">{eventType.description}</p>
                      </div>
                      <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* See also — Wikipedia-style cross-links */}
        <section className="relative py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
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
