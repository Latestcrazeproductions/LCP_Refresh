'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useContent } from '@/context/ContentContext';
import type { ServiceItem } from '@/lib/content';
import { SERVICE_ICON_MAP } from '@/lib/service-icons';

export default function Services() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  const { services } = useContent();
  const items = Array.isArray(services?.items) ? services.items : [];

  return (
    <section id="expertise" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{services?.sectionTitle ?? 'Technical Precision'}</h2>
            <p className="text-gray-400 max-w-md">{services?.sectionSubhead ?? 'Our toolkit for creating unforgettable experiences.'}</p>
          </div>
          <div className="text-right hidden md:block">
             <span className="text-xs uppercase tracking-widest text-gray-600">Capabilities 01 — {String(items.length).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {items.map((service, index) => {
            const IconComponent = SERVICE_ICON_MAP[service.iconKey as keyof typeof SERVICE_ICON_MAP];
            const serviceWithIcon = { ...service, icon: IconComponent ? <IconComponent className="w-6 h-6" /> : null };
            return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => service.details && setSelectedService(service)}
            >
              {/* Background Image */}
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
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
                      {serviceWithIcon.icon}
                    </div>
                    <h3 className="text-3xl font-bold mb-2 text-white">{service.title}</h3>
                    <p className="text-gray-300 max-w-sm">{service.description}</p>
                  </div>
                  {service.details && (
                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedService(null)}
            />
            <motion.div 
              layoutId={`card-${selectedService.id}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0A0A0A] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl z-50 flex flex-col scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 md:h-80 shrink-0">
                {selectedService.image ? (
                  <Image
                    src={selectedService.image}
                    alt={selectedService.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 md:p-10 -mt-12 relative">
                <div className="mb-6 p-3 w-fit rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 relative z-10">
                  {(() => {
                    const Icon = SERVICE_ICON_MAP[selectedService.iconKey as keyof typeof SERVICE_ICON_MAP];
                    return Icon ? <Icon className="w-6 h-6" /> : null;
                  })()}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">{selectedService.title}</h3>
                
                {selectedService.details && (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-semibold text-blue-400 mb-2">{selectedService.details.headline}</h4>
                      <p className="text-gray-300 leading-relaxed text-lg">{selectedService.details.text}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <h5 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Key Specifications</h5>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedService.details.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-300">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap justify-end gap-3">
                  <Link
                    href={`/services/${selectedService.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setSelectedService(null)}
                  >
                    See more details
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={() => setSelectedService(null)}
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
