import type { ReactNode } from 'react';
import Hero, { type HeroBreadcrumb, type HeroSize } from '@/components/Hero';
import type { SeoImageInput } from '@/lib/seo-image';

export interface SeoPageHeroProps {
  title: string;
  description?: string;
  eyebrow?: string;
  date?: string;
  backHref?: string;
  backLabel?: string;
  breadcrumbs?: HeroBreadcrumb[];
  imageLabel?: string;
  images?: SeoImageInput[];
  /** hub ≈ landing pages; index ≈ section indexes; article ≈ posts & tools */
  size?: Exclude<HeroSize, 'full'>;
  children?: ReactNode;
}

/** Shared hero for demand-engine pages — homepage slideshow at a shorter height. */
export function SeoPageHero({
  title,
  description,
  eyebrow,
  date,
  backHref,
  backLabel,
  breadcrumbs,
  images,
  size = 'article',
  children,
}: SeoPageHeroProps) {
  return (
    <Hero
      headline={title}
      subhead={description}
      eyebrow={eyebrow}
      date={date}
      backHref={backHref}
      backLabel={backLabel}
      breadcrumbs={breadcrumbs}
      images={images}
      size={size}
      showScrollIndicator={false}
    >
      {children}
    </Hero>
  );
}
