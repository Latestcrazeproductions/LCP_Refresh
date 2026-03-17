import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import { getServiceIcon } from '@/lib/service-icons';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import Navbar from '@/components/Navbar';
import ContactCta from '@/components/ContactCta';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const content = await getSiteContent();
  const items = content?.services?.items ?? [];
  return items.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const items = Array.isArray(content?.services?.items) ? content.services.items : [];
  const service = items.find((s) => s.id === slug);
  if (!service) return { title: 'Service Not Found' };

  const serviceTitle = String(service.title);
  const title = `${serviceTitle} | Latest Craze Productions`;
  const description =
    (service.description && String(service.description)) ||
    `Latest Craze Productions provides ${serviceTitle} for corporate events in Phoenix and nationwide.`;

  return {
    title,
    description,
    openGraph: {
      title: `${serviceTitle} | Latest Craze Productions`,
      description,
      url: `${SITE_URL}/services/${slug}`,
      images: service.image ? [{ url: String(service.image), alt: serviceTitle }] : undefined,
    },
    alternates: { canonical: `${SITE_URL}/services/${slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const items = Array.isArray(content?.services?.items) ? content.services.items : [];
  const service = items.find((s) => s.id === slug);
  const allServices = items;
  const otherServices = allServices.filter((s) => s.id !== slug);

  if (!service) notFound();

  const IconComponent = getServiceIcon(service.iconKey || '');
  const serviceCount = allServices.length;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Latest Craze Productions',
      url: SITE_URL,
    },
    areaServed: { '@type': 'Country', name: 'United States' },
    image: service.image || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContentProvider content={content}>
        <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30 relative overflow-hidden">
          {/* Subtle background glow — matches Technical Precision */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

          <Navbar />

          {/* Hero — matches modal/Technical Precision card style */}
          <section className="relative pt-24 pb-0">
            <div className="relative h-[45vh] min-h-[320px] max-h-[500px] w-full">
              {service.image ? (
                <Image
                  src={getOptimizedImageUrl(service.image, { width: 1600, quality: 68 })}
                  alt={service.title}
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
                      <Link href="/services" className="hover:text-white transition-colors">
                        Technical Precision
                      </Link>
                      <span className="mx-2">/</span>
                      <span className="text-white">{service.title}</span>
                    </nav>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                      {service.title}
                    </h1>
                    <p className="text-gray-300 mt-2 max-w-2xl text-lg">
                      {service.description}
                    </p>
                  </div>
                  <div className="hidden md:block text-right">
                    <span className="text-xs uppercase tracking-widest text-gray-500">
                      Capabilities 01 — {String(serviceCount).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content — matches Technical Precision modal layout */}
          <section className="relative py-16 px-6 max-w-4xl mx-auto">
            <div className="space-y-10">
              {service.details ? (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-blue-400 mb-3">
                      {service.details.headline}
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {service.details.text}
                    </p>
                  </div>

                  {service.details.features && service.details.features.length > 0 && (
                    <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/5">
                      <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                        Key Specifications
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.details.features.map((feature, idx) => (
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
                    to discuss how we can bring {service.title.toLowerCase()} to your next event.
                  </p>
                </>
              ) : (
                <div>
                  <p className="text-gray-300 leading-relaxed text-lg">{service.description}</p>
                  <p className="mt-6">
                    <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline font-medium">
                      Contact us
                    </Link>{' '}
                    to discuss your next event.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Other services — thumbnail cards matching homepage */}
          {otherServices.length > 0 && (
            <section className="relative py-16 px-6 border-t border-white/10">
              <div className="max-w-7xl mx-auto">
                <div className="mb-10 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold">Other Capabilities</h2>
                  <Link
                    href="/services"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    View all services →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherServices.map((s) => {
                    const OtherIcon = getServiceIcon(s.iconKey || '');
                    return (
                      <Link
                        key={s.id}
                        href={`/services/${s.id}`}
                        className="group relative h-[320px] rounded-2xl overflow-hidden block"
                      >
                        {s.image ? (
                          <Image
                            src={getOptimizedImageUrl(s.image, { width: 1200, quality: 68 })}
                            alt={s.title}
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
                          <h3 className="text-xl font-bold text-white">{s.title}</h3>
                          <p className="text-gray-300 text-sm mt-1 line-clamp-2">{s.description}</p>
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

          {/* See also */}
          <section className="relative py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
            <h2 className="text-xl font-semibold text-gray-400 mb-4">See also</h2>
            <ul className="flex flex-wrap gap-4">
              <li><Link href="/services" className="text-blue-400 hover:text-blue-300 underline">All services</Link></li>
              <li><Link href="/events" className="text-blue-400 hover:text-blue-300 underline">Events we create</Link></li>
              <li><Link href="/about" className="text-blue-400 hover:text-blue-300 underline">About us</Link></li>
              <li><Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact</Link></li>
            </ul>
          </section>

          <ContactCta content={content} />
          <Footer />
        </main>
      </ContentProvider>
    </>
  );
}
