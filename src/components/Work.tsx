'use client';

import Image from 'next/image';
import { useContent } from '@/context/ContentContext';
import { getOptimizedImageUrl } from '@/lib/image-utils';

export default function Work() {
  const { work } = useContent();
  const clients = Array.isArray(work?.clients) ? work.clients : [];
  const duplicated = [...clients, ...clients];

  return (
    <section id="work" className="relative z-20 bg-nexus-black py-12 md:py-16">
      <div className="flex flex-col items-center gap-6">
        {/* Trusted label — outside white band, on dark background */}
        <p className="text-sm uppercase tracking-widest text-gray-500 text-center font-normal">
          {work?.clientsLabel ?? 'Trusted by Industry Leaders'}
        </p>

        {/* White band — snug, scroll marquee inside */}
        <div className="w-full overflow-hidden rounded-none">
          <div className="bg-white py-4 md:py-5 overflow-hidden">
            <div className="lcp-marquee flex gap-12 md:gap-16 items-center whitespace-nowrap">
              {duplicated.map((client, index) =>
                client.type === 'logo' ? (
                  <div
                    key={`${index}-${client.src}`}
                    className="shrink-0 h-10 w-20 md:h-12 md:w-24 flex items-center justify-center"
                  >
                    <Image
                      src={client.src}
                      alt={client.alt}
                      width={96}
                      height={48}
                      className="h-10 w-auto max-w-[80px] md:h-12 md:max-w-[96px] object-contain object-center opacity-80"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <span
                    key={`${index}-${client.value}`}
                    className="text-xs md:text-sm font-display font-semibold text-gray-500 uppercase tracking-wider shrink-0"
                  >
                    {client.value}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
