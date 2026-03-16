import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import { getServiceIcon } from '@/lib/service-icons';
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

  const IconComponent = getServiceIcon(eventType.iconKey || '');
  const eventTypeCount = allEventTypes.length;

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
        <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30 relative overflow-hidden">
          {/* Subtle background glow — matches services page */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

          <Navbar />

          {/* Hero — matches services page: full-width image with overlay content */}
          <section className="relative pt-24 pb-0">
            <div className="relative h-[45vh] min-h-[320px] max-h-[500px] w-full">
              {eventType.image ? (
                <Image
                  src={eventType.image}
                  alt={eventType.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div>
                    {IconComponent && (
                      <div className="mb-4 p-3 w-fit rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-900/20">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    )}
                    <nav className="text-sm text-gray-400 mb-2">
                      <Link href="/events" className="hover:text-white transition-colors">
                        Events We Create
                      </Link>
                      <span className="mx-2">/</span>
                      <span className="text-white">{eventType.title}</span>
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                      {eventType.title}
                    </h1>
                    <p className="text-gray-300 mt-2 max-w-2xl text-lg">
                      {eventType.description}
                    </p>
                  </div>
                  <div className="hidden md:block text-right">
                    <span className="text-xs uppercase tracking-widest text-gray-500">
                      Event Types — {String(eventTypeCount).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content — matches services page layout */}
          <section className="relative py-16 px-6 max-w-4xl mx-auto">
            <div className="space-y-10">
              {eventType.details ? (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-blue-400 mb-3">
                      {eventType.details.headline}
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {eventType.details.text}
                    </p>
                  </div>

                  {eventType.details.features && eventType.details.features.length > 0 && (
                    <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/5">
                      <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                        Key Highlights
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {eventType.details.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-300">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{feature.replace(/^\d+\.\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-gray-400">
                    <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline font-medium">
                      Contact us
                    </Link>{' '}
                    to discuss your next {eventType.title.toLowerCase()} event.
                  </p>
                </>
              ) : (
                <div>
                  <p className="text-gray-300 leading-relaxed text-lg">{eventType.description}</p>
                  <p className="mt-6">
                    <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline font-medium">
                      Contact us
                    </Link>{' '}
                    to discuss your next {eventType.title.toLowerCase()} event.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Other event types — thumbnail cards matching services "Other Capabilities" */}
          {otherEventTypes.length > 0 && (
            <section className="relative py-16 px-6 border-t border-white/10">
              <div className="max-w-7xl mx-auto">
                <div className="mb-10 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold">Other Events We Create</h2>
                  <Link
                    href="/events"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View all events →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherEventTypes.map((e) => {
                    const OtherIcon = getServiceIcon(e.iconKey || '');
                    return (
                      <Link
                        key={e.id}
                        href={`/events/${e.id}`}
                        className="group relative h-[320px] rounded-2xl overflow-hidden block"
                      >
                        {e.image ? (
                          <Image
                            src={e.image}
                            alt={e.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                          {OtherIcon && (
                            <div className="mb-3 p-2.5 w-fit rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                              <OtherIcon className="w-5 h-5" />
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-white">{e.title}</h3>
                          <p className="text-gray-300 text-sm mt-1 line-clamp-2">{e.description}</p>
                          <div className="mt-3 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white w-fit opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* See also — matches services page */}
          <section className="relative py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
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
