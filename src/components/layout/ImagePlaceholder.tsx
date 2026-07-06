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
}

export function ImagePlaceholder({
  label = 'Image placeholder',
  aspect = 'wide',
  className = '',
  fill = false,
}: ImagePlaceholderProps) {
  const base = fill
    ? 'absolute inset-0'
    : `relative w-full ${aspectClasses[aspect]}`;

  return (
    <div
      className={`${base} overflow-hidden rounded-none bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-800 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
          <ImageIcon className="h-6 w-6 text-white/40" strokeWidth={1.5} />
        </div>
        <span className="max-w-xs text-xs font-medium uppercase tracking-widest text-white/30">
          {label}
        </span>
      </div>
    </div>
  );
}
