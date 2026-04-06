import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import { resolveSeoImage, type SeoImageInput } from '@/lib/seo-image';

type ImageGalleryProps = {
  /** Strings or `{ src, alt? }` — backward compatible. */
  images: SeoImageInput[];
  /** Page context for fallback alt (e.g. service title). */
  alt: string;
};

/** Simple 3-image gallery. Renders nothing if fewer than 1 image. */
export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const displayImages = images.slice(0, 3).filter((entry) => {
    const s = typeof entry === 'string' ? entry : entry?.src;
    return Boolean(s && String(s).trim());
  });
  if (displayImages.length === 0) return null;

  return (
    <section className="relative py-12 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-400 mb-6">Gallery</h2>
        <div
          className={`grid gap-4 ${
            displayImages.length === 1
              ? 'grid-cols-1'
              : displayImages.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {displayImages.map((raw, i) => {
            const { src, alt: imgAlt } = resolveSeoImage(raw, `${alt} — gallery photo ${i + 1}`);
            return (
            <div
              key={`${src}-${i}`}
              className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10"
            >
              <Image
                src={getOptimizedImageUrl(src, { width: 800, quality: 75 })}
                alt={imgAlt}
                fill
                className="object-cover"
                sizes={
                  displayImages.length === 1
                    ? '(max-width: 768px) 100vw, 672px'
                    : displayImages.length === 2
                      ? '(max-width: 768px) 100vw, 50vw'
                      : '(max-width: 768px) 100vw, 33vw'
                }
              />
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
