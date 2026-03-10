'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Mic2, Package, Award, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import type { EventTypeItem } from '@/lib/content';

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

const EVENT_ICON_MAP = {
  mic2: Mic2,
  package: Package,
  award: Award,
  users: Users,
  sparkles: Sparkles,
} as const;

export default function EventTypes() {
  const { eventTypes } = useContent();
  const items = Array.isArray(eventTypes?.items) ? eventTypes.items : [];
  const [selected, setSelected] = useState<EventTypeItem | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected]);

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
            <motion.div
              key={eventType.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(eventType)}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(eventType)}
              className={`relative group overflow-hidden rounded-xl cursor-pointer ${getSize(index)}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
                <h3 className="text-2xl font-bold text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {eventType.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal — matches Technical Precision (Services) modal design */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0A0A0A] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl z-50 flex flex-col scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 md:h-80 shrink-0">
                {selected.image ? (
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 md:p-10 -mt-12 relative">
                {selected.iconKey && selected.iconKey in EVENT_ICON_MAP && (
                  <div className="mb-6 p-3 w-fit rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 relative z-10">
                    {(() => {
                      const Icon = EVENT_ICON_MAP[selected.iconKey as keyof typeof EVENT_ICON_MAP];
                      return Icon ? <Icon className="w-6 h-6" /> : null;
                    })()}
                  </div>
                )}

                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">{selected.title}</h3>

                {selected.details ? (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-semibold text-blue-400 mb-2">{selected.details.headline}</h4>
                      <p className="text-gray-300 leading-relaxed text-lg">{selected.details.text}</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <h5 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Key Highlights</h5>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selected.details.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-300">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 leading-relaxed text-lg">{selected.description}</p>
                )}

                <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap justify-end gap-3">
                  <Link
                    href={`/events/${selected.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View full details
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 border border-white/10 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
