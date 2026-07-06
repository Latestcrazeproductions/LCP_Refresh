import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';

interface ContentIndexCardProps {
  href: string;
  title: string;
  description?: string;
  eyebrow?: string;
  date?: string;
  imageLabel?: string;
}

export function ContentIndexCard({
  href,
  title,
  description,
  eyebrow,
  date,
  imageLabel,
}: ContentIndexCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-colors hover:border-white/10 hover:bg-white/[0.04]"
    >
      <div className="relative h-52 overflow-hidden">
        <ImagePlaceholder label={imageLabel ?? title} aspect="wide" fill className="rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              {eyebrow}
            </span>
          )}
          {date && <span className="text-xs text-gray-500">{date}</span>}
        </div>
        <h3 className="text-xl font-bold leading-snug text-white transition-colors group-hover:text-blue-100 md:text-2xl">
          {title}
        </h3>
        {description && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-400">
            {description}
          </p>
        )}
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-400">
          <span>Read more</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
