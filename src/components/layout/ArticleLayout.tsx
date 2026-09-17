import type { ReactNode } from 'react';
import type { SeoImageInput } from '@/lib/seo-image';
import { SeoPageHero } from './SeoPageHero';

interface ArticleLayoutProps {
  title: string;
  description?: string;
  eyebrow?: string;
  date?: string;
  backHref: string;
  backLabel: string;
  imageLabel?: string;
  images?: SeoImageInput[];
  share?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function ArticleLayout({
  title,
  description,
  eyebrow,
  date,
  backHref,
  backLabel,
  imageLabel,
  images,
  share,
  children,
  footer,
}: ArticleLayoutProps) {
  return (
    <>
      <SeoPageHero
        title={title}
        description={description}
        eyebrow={eyebrow}
        date={date}
        backHref={backHref}
        backLabel={backLabel}
        imageLabel={imageLabel ?? title}
        images={images}
        size="article"
      >
        {share}
      </SeoPageHero>

      <section className="px-6 py-12">
        <article className="mx-auto max-w-3xl">{children}</article>
      </section>

      {footer}
    </>
  );
}
