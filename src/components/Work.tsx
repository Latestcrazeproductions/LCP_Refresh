'use client';

import { motion } from 'motion/react';
import { useContent } from '@/context/ContentContext';

export default function Work() {
  const { work } = useContent();
  const clients = Array.isArray(work?.clients) ? work.clients : [];

  return (
    <section id="work" className="relative z-20">
      {/* Client logos / names marquee */}
      <div className="py-12 bg-black border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <p className="text-xs uppercase tracking-widest text-gray-600 text-center">
            {work?.clientsLabel ?? 'Trusted by Industry Leaders'}
          </p>
        </div>

        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex gap-20 whitespace-nowrap pr-20 items-center"
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
                    className="shrink-0 h-20 w-40 flex items-center justify-center transition-opacity hover:opacity-100 opacity-90"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.src}
                      alt={client.alt}
                      className="max-h-20 w-auto max-w-[160px] object-contain object-center"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <span
                    key={`${index}-${client.value}`}
                    className="text-2xl md:text-4xl font-display font-bold text-white/20 uppercase tracking-tighter hover:text-white/40 transition-colors cursor-default shrink-0"
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
