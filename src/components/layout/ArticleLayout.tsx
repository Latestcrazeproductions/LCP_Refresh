import type { ReactNode } from 'react';
import { SeoPageHero } from './SeoPageHero';

interface ArticleLayoutProps {
  title: string;
  description?: string;
  eyebrow?: string;
  date?: string;
  backHref: string;
  backLabel: string;
  imageLabel?: string;
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
      />

      <section className="px-6 py-12">
        <article className="mx-auto max-w-3xl">{children}</article>
      </section>

      {footer}
    </>
  );
}
