'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';

import { useContent } from '@/context/ContentContext';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import { resolveSeoImage, type SeoImageInput } from '@/lib/seo-image';

const HERO_FALLBACK: SeoImageInput =
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop';

export interface HeroBreadcrumb {
  label: string;
  href?: string;
}

export interface HeroProps {
  /** Page title — when set, overrides homepage headline from CMS. */
  headline?: string;
  /** Supporting line — when set, overrides homepage subhead from CMS. */
  subhead?: string;
  eyebrow?: string;
  date?: string;
  backHref?: string;
  backLabel?: string;
  breadcrumbs?: HeroBreadcrumb[];
  /** Override slideshow images; defaults to CMS hero gallery. */
  images?: SeoImageInput[];
  showScrollIndicator?: boolean;
  children?: ReactNode;
}

export default function Hero({
  headline,
  subhead,
  eyebrow,
  date,
  backHref,
  backLabel,
  breadcrumbs,
  images,
  showScrollIndicator,
  children,
}: HeroProps = {}) {
  const { hero } = useContent();
  const isPageMode = headline !== undefined;

  const rawImages: SeoImageInput[] =
    images ??
    (hero?.images && Array.isArray(hero.images) && hero.images.length > 0
      ? (hero.images as SeoImageInput[])
      : [HERO_FALLBACK]);

  const slides = rawImages.map((raw, i) =>
    resolveSeoImage(
      raw,
      `Latest Craze Productions — corporate event production and LED video walls (slide ${i + 1})`
    )
  );

  const displayHeadline = (headline ?? hero?.headline ?? 'IMMERSIVE IMPACT').replace(/\n/g, ' ');
  const displaySubhead = subhead ?? hero?.subhead ?? 'WE DESIGN EVENTS THAT MOVE PEOPLE';
  const showScroll = showScrollIndicator ?? !isPageMode;

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
    <section
      id={isPageMode ? undefined : 'vision'}
      className="relative flex h-screen w-full items-start justify-center overflow-hidden"
    >
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
            className="pointer-events-none absolute inset-0 object-cover opacity-0"
          />
        )}

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-[#050505]" />
        <div className="absolute inset-0 z-10 bg-black/20" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 pt-24 text-center md:pt-28">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4 text-sm text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label}>
                {i > 0 && <span className="mx-2">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {backHref && backLabel && (
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            ← {backLabel}
          </Link>
        )}

        {(eyebrow || date) && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                {eyebrow}
              </span>
            )}
            {date && <span className="text-xs text-gray-400">{date}</span>}
          </div>
        )}

        <h1
          className={
            isPageMode
              ? 'mx-auto mb-6 max-w-5xl text-4xl font-bold leading-[0.95] tracking-tighter text-white drop-shadow-2xl md:text-6xl lg:text-7xl'
              : 'mb-8 whitespace-nowrap text-4xl font-bold leading-[0.9] tracking-tighter text-white drop-shadow-2xl md:text-6xl lg:text-8xl'
          }
        >
          {displayHeadline}
        </h1>

        {displaySubhead && (
          <p
            className={
              isPageMode
                ? 'mx-auto max-w-3xl text-lg font-bold uppercase leading-relaxed tracking-wide text-white drop-shadow-lg md:text-xl'
                : 'mx-auto max-w-2xl text-lg font-bold uppercase tracking-wide text-white drop-shadow-lg md:text-2xl'
            }
          >
            {displaySubhead}
          </p>
        )}

        {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{children}</div>}
      </div>

      {showScroll && (
        <div className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="font-display text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Scroll
            </span>
            <ChevronDown className="h-6 w-6 animate-bounce text-white/50" />
          </div>
        </div>
      )}
    </section>
  );
}
