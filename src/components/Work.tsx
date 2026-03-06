'use client';

import { motion } from 'motion/react';
import { useContent } from '@/context/ContentContext';

export default function Work() {
  const { work } = useContent();
  const clients = Array.isArray(work?.clients) ? work.clients : [];

  return (
    <section id="work" className="relative z-20">
      {/* Client logos / names marquee */}
      <div className="py-10 md:py-12 bg-white border-y border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 md:mb-8">
          <p className="text-sm uppercase tracking-widest text-gray-600 text-center font-medium">
            {work?.clientsLabel ?? 'Trusted by Industry Leaders'}
          </p>
        </div>

        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex gap-16 md:gap-24 whitespace-nowrap pr-16 md:pr-24 items-center"
            animate={{ x: '-50%' }}
            transition={{
              repeat: Infinity,
              duration: 90,
              ease: 'linear',
            }}
          >
            {[...clients, ...clients, ...clients, ...clients].map(
              (client, index) =>
                client.type === 'logo' ? (
                  <div
                    key={`${index}-${client.src}`}
                    className="shrink-0 h-14 w-28 md:h-20 md:w-40 flex items-center justify-center transition-opacity hover:opacity-100 opacity-90"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.src}
                      alt={client.alt}
                      className="h-14 w-auto max-w-[112px] md:h-20 md:max-w-[160px] object-contain object-center"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <span
                    key={`${index}-${client.value}`}
                    className="text-xl md:text-3xl font-display font-bold text-gray-300 uppercase tracking-tighter hover:text-gray-500 transition-colors cursor-default shrink-0"
                  >
                    {client.value}
                  </span>
                )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
