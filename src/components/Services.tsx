'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { SERVICE_ICON_MAP } from '@/lib/service-icons';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import { getImageSrc, resolveSeoImage } from '@/lib/seo-image';
import type { ServiceItem } from '@/lib/content';

const LazyServiceModalContent = dynamic(() => import('@/components/ServiceModalContent'));

function canUseDesktopModal() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
}

export default function Services() {
  const { services, brand } = useContent();
  const items = Array.isArray(services?.items) ? services.items : [];
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [shouldLoadModal, setShouldLoadModal] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  useEffect(() => {
    if (!selectedService) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedService(null);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedService]);

  function handleCardActivate(
    event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
    service: ServiceItem
  ) {
    if (!isDesktop || !service.details || !canUseDesktopModal()) {
      return;
    }

    event.preventDefault();
    setShouldLoadModal(true);
    setSelectedService(service);
  }

  return (
    <section id="expertise" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 border-b border-white/10 pb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{services?.sectionTitle ?? 'Technical Precision'}</h2>
          <p className="text-gray-400 max-w-md">{services?.sectionSubhead ?? 'Our toolkit for creating unforgettable experiences.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {items.map((service, index) => {
            const IconComponent = SERVICE_ICON_MAP[service.iconKey as keyof typeof SERVICE_ICON_MAP];
            return (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group relative h-[400px] rounded-2xl overflow-hidden block"
              prefetch={index < 2}
              onClick={(event) => handleCardActivate(event, service)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handleCardActivate(event, service);
                }
              }}
            >
              {/* Background Image */}
              {getImageSrc(service.image) ? (
                <Image
                  src={getOptimizedImageUrl(getImageSrc(service.image), { width: 1280, quality: 68 })}
                  alt={
                    resolveSeoImage(
                      service.image,
                      `${service.title} — ${brand?.nameFull ?? 'Latest Craze Productions'} corporate event AV service`
                    ).alt
                  }
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="mb-4 p-3 w-fit rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                      {IconComponent ? <IconComponent className="w-6 h-6" /> : null}
                    </div>
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
      </div>

      {shouldLoadModal ? (
        <LazyServiceModalContent
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      ) : null}
    </section>
  );
}
