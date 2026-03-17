'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import type { EventTypeItem } from '@/lib/content';

const LazyEventTypeModalContent = dynamic(() => import('@/components/EventTypeModalContent'));

function canUseDesktopModal() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
}

/** Bento sizes matching featured projects gallery — col-span-2, col-span-1 */
const GALLERY_SIZES = [
  'col-span-1 md:col-span-2',
  'col-span-1',
  'col-span-1',
  'col-span-1 md:col-span-2',
  'col-span-1',
  'col-span-1',
  'col-span-1 md:col-span-2',
] as const;

function getSize(index: number): string {
  return GALLERY_SIZES[index % GALLERY_SIZES.length];
}

export default function EventTypes() {
  const { eventTypes } = useContent();
  const items = Array.isArray(eventTypes?.items) ? eventTypes.items : [];
  const [selectedEventType, setSelectedEventType] = useState<EventTypeItem | null>(null);
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
    if (selectedEventType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEventType]);

  useEffect(() => {
    if (!selectedEventType) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedEventType(null);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedEventType]);

  function handleCardActivate(
    event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
    eventType: EventTypeItem
  ) {
    if (!isDesktop || !eventType.details || !canUseDesktopModal()) {
      return;
    }

    event.preventDefault();
    setShouldLoadModal(true);
    setSelectedEventType(eventType);
  }

  return (
    <section id="events" className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            {eventTypes?.sectionTitle ?? 'Events We Create'}
          </h2>
          <p className="text-gray-400 mt-4 md:mt-0 max-w-xs text-right">
            {eventTypes?.sectionSubhead ??
              'From high-stakes keynotes to immersive brand activations.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[400px]">
          {items.map((eventType, index) => (
            <Link
              key={eventType.id}
              href={`/events/${eventType.id}`}
              className={`relative group overflow-hidden rounded-xl cursor-pointer ${getSize(index)}`}
              prefetch={index < 2}
              onClick={(event) => handleCardActivate(event, eventType)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handleCardActivate(event, eventType);
                }
              }}
            >
              {eventType.image ? (
                  <Image
                  src={eventType.image}
                  alt={eventType.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                {eventType.description && (
                  <p className="text-blue-400/90 text-sm mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 line-clamp-2">
                    {eventType.description}
                  </p>
                )}
                <div className="flex items-end justify-between gap-4">
                  <h3 className="text-2xl font-bold text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {eventType.title}
                  </h3>
                  <span className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {shouldLoadModal ? (
        <LazyEventTypeModalContent
          eventType={selectedEventType}
          onClose={() => setSelectedEventType(null)}
        />
      ) : null}
    </section>
  );
}
