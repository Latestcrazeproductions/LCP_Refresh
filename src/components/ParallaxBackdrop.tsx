'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type ParallaxBackdropProps = {
  src: string;
  alt: string;
  /** Larger = more movement vs scroll depth */
  intensity?: number;
};

/**
 * Full-bleed background with subtle vertical parallax while the page scrolls.
 * Overflow hidden assumes a parent clipping region (typically the hero `<header>`).
 */
export default function ParallaxBackdrop({
  src,
  alt,
  intensity = 0.35,
}: ParallaxBackdropProps) {
  const [offsetPx, setOffsetPx] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) {
      setOffsetPx(0);
      return;
    }

    const update = () => {
      rafRef.current = null;
      const y = typeof window !== 'undefined' ? window.scrollY : 0;
      setOffsetPx(y * intensity);
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Extra height so shifting on scroll doesn't show edges */}
      <div
        className="absolute left-0 right-0 top-[-10vh] w-full will-change-transform"
        style={{
          height: '120vh',
          transform: `translate3d(0, ${offsetPx}px, 0)`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
