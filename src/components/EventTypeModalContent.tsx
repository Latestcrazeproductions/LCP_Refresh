'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { SERVICE_ICON_MAP } from '@/lib/service-icons';
import type { EventTypeItem } from '@/lib/content';
import { getOptimizedImageUrl } from '@/lib/image-utils';

type EventTypeModalContentProps = {
  eventType: EventTypeItem | null;
  onClose: () => void;
};

export default function EventTypeModalContent({
  eventType,
  onClose,
}: EventTypeModalContentProps) {
  return (
    <AnimatePresence>
      {eventType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#0A0A0A] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl z-50 flex flex-col scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 md:h-80 shrink-0">
              {eventType.image ? (
                <Image
                  src={eventType.image}
                  alt={eventType.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 960px"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-10 -mt-12 relative">
              {eventType.iconKey && eventType.iconKey in SERVICE_ICON_MAP && (
                <div className="mb-6 p-3 w-fit rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 relative z-10">
                  {(() => {
                    const Icon = SERVICE_ICON_MAP[eventType.iconKey as keyof typeof SERVICE_ICON_MAP];
                    return Icon ? <Icon className="w-6 h-6" /> : null;
                  })()}
                </div>
              )}

              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">{eventType.title}</h3>

              {eventType.details ? (
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold text-blue-400 mb-2">
                      {eventType.details.headline}
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {eventType.details.text}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <h5 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
                      Key Highlights
                    </h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {eventType.details.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-300">
                          <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed text-lg">{eventType.description}</p>
              )}

              <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap justify-end gap-3">
                <Link
                  href={`/events/${eventType.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={onClose}
                >
                  View full details
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
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
  );
}
