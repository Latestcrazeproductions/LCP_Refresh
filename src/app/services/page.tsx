import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getSiteContent } from '@/lib/content';
import { ContentProvider } from '@/context/ContentContext';
import { getServiceIcon } from '@/lib/service-icons';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import Navbar from '@/components/Navbar';
import { ImageGallery } from '@/components/ImageGallery';
import ContactCta from '@/components/ContactCta';
import Footer from '@/components/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Latest Craze Productions offers LED video walls, intelligent lighting, stage design, precision audio, scenic design, and projection mapping for corporate events. Full-service AV production in Phoenix and nationwide.',
  openGraph: {
    title: 'Services | Latest Craze Productions',
    description:
      'LED video walls, lighting, stage design, audio, scenic design, and projection mapping for corporate events.',
    url: `${SITE_URL}/services`,
  },
  alternates: { canonical: `${SITE_URL}/services` },
};

export default async function ServicesPage() {
  const content = await getSiteContent();
  const services = Array.isArray(content?.services?.items) ? content.services.items : [];

  return (
    <ContentProvider content={content}>
      <main className="bg-[#050505] min-h-screen text-white selection:bg-blue-500/30 relative overflow-hidden">
        {/* Subtle background glow — matches Technical Precision */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

        <Navbar />

        {/* Lead + section header — matches Technical Precision */}
        <section className="relative pt-32 pb-12 px-6 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Event Production Services
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mb-16">
            Latest Craze Productions is a Phoenix-based corporate event production company. We provide LED video walls, intelligent lighting, stage design, precision audio, scenic design, and projection mapping for keynotes, product launches, galas, conferences, and brand activations. See our <Link href="/events" className="text-blue-400 hover:text-blue-300 underline">events we create</Link> and <Link href="/about" className="text-blue-400 hover:text-blue-300 underline">about us</Link>. <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact us</Link> to discuss your next event.
          </p>

          <div className="mb-12 border-b border-white/10 pb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{content?.services?.sectionTitle ?? 'Technical Precision'}</h2>
            <p className="text-gray-400 max-w-md">{content?.services?.sectionSubhead ?? 'Our toolkit for creating unforgettable experiences.'}</p>
          </div>
        </section>

        {/* Thumbnail grid — matches homepage Technical Precision cards */}
        <section className="relative py-8 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {services.map((service) => {
              const IconComponent = getServiceIcon(service.iconKey || '');
              return (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="group relative h-[400px] rounded-2xl overflow-hidden block"
                >
                  {service.image ? (
                    <Image
                      src={getOptimizedImageUrl(service.image, { width: 1280, quality: 68 })}
                      alt={service.title}
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
                        <h3 className="text-3xl font-bold mb-2 text-white">{service.title}</h3>
                        <p className="text-gray-300 max-w-sm">{service.description}</p>
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

        {/* See also */}
        <section className="relative py-12 px-6 max-w-4xl mx-auto border-t border-white/10">
          <h2 className="text-xl font-semibold text-gray-400 mb-4">See also</h2>
          <ul className="flex flex-wrap gap-4">
            <li><Link href="/events" className="text-blue-400 hover:text-blue-300 underline">Events we create</Link></li>
            <li><Link href="/about" className="text-blue-400 hover:text-blue-300 underline">About Latest Craze Productions</Link></li>
            <li><Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">Contact us</Link></li>
          </ul>
        </section>

        <ContactCta content={content} />
        <Footer />
      </main>
    </ContentProvider>
  );
}
