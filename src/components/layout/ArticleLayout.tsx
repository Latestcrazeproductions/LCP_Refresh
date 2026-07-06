import type { ReactNode } from 'react';
import Link from 'next/link';
import { PageHero } from './PageHero';
import { ImagePlaceholder } from './ImagePlaceholder';

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
      <section className="relative pt-24">
        <div className="relative h-[40vh] min-h-[280px] max-h-[440px] w-full">
          <ImagePlaceholder label={imageLabel ?? title} aspect="hero" fill />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="mx-auto max-w-4xl">
              <Link
                href={backHref}
                className="mb-4 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
              >
                ← {backLabel}
              </Link>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {eyebrow && (
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                    {eyebrow}
                  </span>
                )}
                {date && <span className="text-xs text-gray-500">{date}</span>}
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
              {description && (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-300">{description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <article className="mx-auto max-w-3xl">{children}</article>
      </section>

      {footer}
    </>
  );
}
