import { ImageIcon } from 'lucide-react';

type AspectRatio = 'video' | 'wide' | 'square' | 'hero';

const aspectClasses: Record<AspectRatio, string> = {
  video: 'aspect-video',
  wide: 'aspect-[16/10]',
  square: 'aspect-square',
  hero: 'aspect-[21/9] min-h-[280px]',
};

interface ImagePlaceholderProps {
  label?: string;
  aspect?: AspectRatio;
  className?: string;
  fill?: boolean;
  variant?: 'dark' | 'light';
}

export function ImagePlaceholder({
  label = 'Image placeholder',
  aspect = 'wide',
  className = '',
  fill = false,
  variant = 'dark',
}: ImagePlaceholderProps) {
  const base = fill
    ? 'absolute inset-0'
    : `relative w-full ${aspectClasses[aspect]}`;

  const surface =
    variant === 'light'
      ? 'bg-gradient-to-br from-slate-200 via-stone-100 to-blue-100'
      : 'bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-800';
  const gridOpacity = variant === 'light' ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.03)';
  const overlay =
    variant === 'light'
      ? 'bg-gradient-to-t from-stone-50/80 via-transparent to-transparent'
      : 'bg-gradient-to-t from-black/40 via-transparent to-transparent';
  const iconWrap =
    variant === 'light'
      ? 'rounded-xl border border-slate-200/80 bg-white/80 p-3 shadow-sm'
      : 'rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm';
  const iconColor = variant === 'light' ? 'text-slate-400' : 'text-white/40';
  const labelColor = variant === 'light' ? 'text-slate-500/80' : 'text-white/30';

  return (
    <div
      className={`${base} overflow-hidden rounded-none ${surface} ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-[size:32px_32px]"
        style={{
          backgroundImage: `linear-gradient(${gridOpacity} 1px, transparent 1px), linear-gradient(90deg, ${gridOpacity} 1px, transparent 1px)`,
        }}
      />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className={iconWrap}>
          <ImageIcon className={`h-6 w-6 ${iconColor}`} strokeWidth={1.5} />
        </div>
        <span className={`max-w-xs text-xs font-medium uppercase tracking-widest ${labelColor}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
