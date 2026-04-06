'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useContent } from '@/context/ContentContext';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import { resolveSeoImage, type SeoImageInput } from '@/lib/seo-image';

const HERO_FALLBACK: SeoImageInput =
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop';

export default function Hero() {
  const { hero } = useContent();
  const rawImages: SeoImageInput[] =
    hero?.images && Array.isArray(hero.images) && hero.images.length > 0
      ? (hero.images as SeoImageInput[])
      : [HERO_FALLBACK];
  const slides = rawImages.map((raw, i) =>
    resolveSeoImage(
      raw,
      `Latest Craze Productions — corporate event production and LED video walls (slide ${i + 1})`
    )
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [isCurrentVisible, setIsCurrentVisible] = useState(true);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => {
        setPreviousImageIndex(prev);
        setIsFading(true);
        setIsCurrentVisible(false);
        return (prev + 1) % slides.length;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (!isFading) return;
    const frame = window.requestAnimationFrame(() => {
      setIsCurrentVisible(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentImageIndex, isFading]);

  useEffect(() => {
    if (!isFading) return;
    const timer = setTimeout(() => {
      setIsFading(false);
      setPreviousImageIndex(null);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isFading]);

  return (
    <section id="vision" className="relative h-screen w-full flex items-start justify-center overflow-hidden">
      {/* Background Image Slideshow with Overlay */}
      <div className="absolute inset-0 z-0">
        {previousImageIndex !== null && (
          <Image
            key={`${slides[previousImageIndex].src}-${previousImageIndex}-previous`}
            src={getOptimizedImageUrl(slides[previousImageIndex].src, { width: 2400, quality: 75 })}
            alt={slides[previousImageIndex].alt}
            fill
            priority={false}
            sizes="100vw"
            className={`absolute inset-0 object-cover transition-opacity duration-[1500ms] ${
              isFading ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        <Image
          key={`${slides[currentImageIndex].src}-${currentImageIndex}`}
          src={getOptimizedImageUrl(slides[currentImageIndex].src, { width: 2400, quality: 75 })}
          alt={slides[currentImageIndex].alt}
          fill
          priority={currentImageIndex === 0}
          sizes="100vw"
          className={`absolute inset-0 object-cover transition-opacity duration-[1500ms] ${
            isCurrentVisible ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {slides.length > 1 && (
          <Image
            key={`${slides[(currentImageIndex + 1) % slides.length].src}-next`}
            src={getOptimizedImageUrl(slides[(currentImageIndex + 1) % slides.length].src, {
              width: 2400,
              quality: 75,
            })}
            alt={slides[(currentImageIndex + 1) % slides.length].alt}
            fill
            priority={false}
            sizes="100vw"
            className="absolute inset-0 object-cover opacity-0 pointer-events-none"
          />
        )}
        
        {/* Gradient overlay for text readability, but keeping image visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505] z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Subtle overall tint for text contrast */}
      </div>

      {/* Content — aligned to top so image remains visible */}
      <div className="relative z-20 text-center px-4 max-w-7xl mx-auto pt-24 md:pt-28">
        <h1
          className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9] drop-shadow-2xl whitespace-nowrap"
        >
          {(hero?.headline ?? 'IMMERSIVE IMPACT').replace(/\n/g, ' ')}
        </h1>

        <p
          className="text-lg md:text-2xl text-white font-bold uppercase tracking-wide max-w-2xl mx-auto drop-shadow-lg"
        >
          {hero?.subhead ?? 'WE DESIGN EVENTS THAT MOVE PEOPLE'}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2">
          <span className="font-display font-bold text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
          <ChevronDown className="w-6 h-6 text-white/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
