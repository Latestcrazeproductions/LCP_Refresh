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
  variant?: 'dark' | 'light';
}

export function ContentIndexCard({
  href,
  title,
  description,
  eyebrow,
  date,
  imageLabel,
  variant = 'dark',
}: ContentIndexCardProps) {
  const isLight = variant === 'light';
  return (
    <Link
      href={href}
      className={
        isLight
          ? 'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:border-blue-200 hover:shadow-md'
          : 'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-colors hover:border-white/10 hover:bg-white/[0.04]'
      }
    >
      <div className="relative h-52 overflow-hidden">
        <ImagePlaceholder
          label={imageLabel ?? title}
          aspect="wide"
          fill
          variant={variant}
          className="rounded-none"
        />
        {!isLight && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          {eyebrow && (
            <span
              className={`text-xs font-semibold uppercase tracking-widest ${isLight ? 'text-blue-700' : 'text-blue-400'}`}
            >
              {eyebrow}
            </span>
          )}
          {date && <span className="text-xs text-slate-500">{date}</span>}
        </div>
        <h3
          className={`text-xl font-bold leading-snug md:text-2xl ${
            isLight
              ? 'text-slate-900 transition-colors group-hover:text-blue-800'
              : 'text-white transition-colors group-hover:text-blue-100'
          }`}
        >
          {title}
        </h3>
        {description && (
          <p className={`mt-2 line-clamp-3 flex-1 text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            {description}
          </p>
        )}
        <div
          className={`mt-5 flex items-center gap-2 text-sm font-medium ${isLight ? 'text-blue-700' : 'text-blue-400'}`}
        >
          <span>Read more</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
