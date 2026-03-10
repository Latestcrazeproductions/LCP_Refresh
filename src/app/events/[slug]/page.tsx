import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const content = await getSiteContent();
  const items = content?.eventTypes?.items ?? [];
  return items.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const eventType = content?.eventTypes?.items?.find((e) => e.id === slug);
  if (!eventType) return { title: 'Event Not Found' };

  const title = `${eventType.title} | Latest Craze Productions`;
  const description =
    eventType.description ||
    `Latest Craze Productions produces ${eventType.title} in Phoenix and nationwide. LED video walls, intelligent lighting, and stage design for corporate events.`;

  return {
    title,
    description,
    openGraph: {
      title: `${eventType.title} | Latest Craze Productions`,
      description,
      url: `${SITE_URL}/events/${slug}`,
      images: eventType.image ? [{ url: eventType.image, alt: eventType.title }] : undefined,
    },
    alternates: { canonical: `${SITE_URL}/events/${slug}` },
  };
}

export default async function EventTypePage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const eventType = content?.eventTypes?.items?.find((e) => e.id === slug);
  const allEventTypes = content?.eventTypes?.items ?? [];

  if (!eventType) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: eventType.title,
    description: eventType.description,
    provider: {
      '@type': 'Organization',
      name: 'Latest Craze Productions',
      url: SITE_URL,
    },
    areaServed: { '@type': 'Country', name: 'United States' },
    image: eventType.image || undefined,
  };

  const otherEventTypes = allEventTypes.filter((e) => e.id !== slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentProvider content={content}>
        <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30">
          <Navbar />

          {/* Lead — direct answer for SEO/AI */}
          <section className="pt-32 pb-12 px-6 max-w-4xl mx-auto">
            <nav className="text-sm text-gray-500 mb-4">
              <Link href="/events" className="hover:text-white transition-colors">
                Events
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{eventType.title}</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {eventType.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Latest Craze Productions delivers {eventType.title.toLowerCase()} in Phoenix and across the United States. {eventType.description}
            </p>
          </section>

          {/* Hero image */}
          {eventType.image && (
            <section className="px-6 max-w-4xl mx-auto mb-16">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image
                  src={eventType.image}
                  alt={eventType.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
              </div>
            </section>
          )}

          {/* Content */}
          <section className="py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
            <h2 className="text-2xl font-bold mb-6">What We Deliver</h2>
            <p className="text-gray-400 mb-6">
              Our team combines LED video walls, intelligent lighting, precision audio, and stage design to create {eventType.title.toLowerCase()} that leave lasting impressions. From concept to execution, we handle the full production lifecycle so you can focus on your message.
            </p>
            <p className="text-gray-400">
              <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline font-medium">
                Contact us
              </Link>{' '}
              to discuss your next {eventType.title.toLowerCase()} event.
            </p>
          </section>

          {/* Other event types */}
          {otherEventTypes.length > 0 && (
            <section className="py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
              <h2 className="text-xl font-semibold text-gray-400 mb-4">Other events we create</h2>
              <ul className="flex flex-wrap gap-3">
                {otherEventTypes.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/events/${e.id}`}
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {e.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* See also */}
          <section className="py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
            <h2 className="text-xl font-semibold text-gray-400 mb-4">See also</h2>
            <ul className="flex flex-wrap gap-4">
              <li><Link href="/events" className="text-blue-400 hover:text-blue-300 underline">All event types</Link></li>
              <li><Link href="/services" className="text-blue-400 hover:text-blue-300 underline">Event production services</Link></li>
              <li><Link href="/about" className="text-blue-400 hover:text-blue-300 underline">About us</Link></li>
              <li><Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact</Link></li>
            </ul>
          </section>

          <Contact />
          <Footer />
        </main>
      </ContentProvider>
    </>
  );
}
