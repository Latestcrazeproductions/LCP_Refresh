import type { ReactNode } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from './ImagePlaceholder';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  lead?: string;
  eyebrow?: string;
  breadcrumbs?: Breadcrumb[];
  imageLabel?: string;
  showImage?: boolean;
  compact?: boolean;
  children?: ReactNode;
}

export function PageHero({
  title,
  lead,
  eyebrow,
  breadcrumbs,
  imageLabel,
  showImage = false,
  compact = false,
  children,
}: PageHeroProps) {
  if (showImage) {
    return (
      <section className="relative pt-24">
        <div className="relative h-[45vh] min-h-[320px] max-h-[520px] w-full">
          <ImagePlaceholder label={imageLabel ?? title} aspect="hero" fill />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="mx-auto max-w-7xl">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-3 text-sm text-gray-400">
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
              {eyebrow && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                  {eyebrow}
                </p>
              )}
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {title}
              </h1>
              {lead && (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-300">{lead}</p>
              )}
              {children}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative px-6 ${compact ? 'pt-28 pb-8' : 'pt-32 pb-12'}`}>
      <div className="mx-auto max-w-7xl">
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
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
            {eyebrow}
          </p>
        )}
        <h1 className="mb-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">{title}</h1>
        {lead && (
          <p className="max-w-3xl text-xl leading-relaxed text-gray-300">{lead}</p>
        )}
        {children}
      </div>
    </section>
  );
}
