import type { ReactNode } from 'react';
import Hero, { type HeroBreadcrumb } from '@/components/Hero';
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
  children?: ReactNode;
}

/** Shared hero for demand-engine pages — same full-screen slideshow as the homepage. */
export function SeoPageHero({
  title,
  description,
  eyebrow,
  date,
  backHref,
  backLabel,
  breadcrumbs,
  images,
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
      showScrollIndicator={false}
    >
      {children}
    </Hero>
  );
}
