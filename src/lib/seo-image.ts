/**
 * Backward-compatible SEO image model: URL string or { src, alt? }.
 * Strings keep working everywhere; optional objects add descriptive alt text.
 */

export type SeoImageInput = string | { src: string; alt?: string };

export function getImageSrc(ref: SeoImageInput | null | undefined): string {
  if (ref == null || ref === '') return '';
  if (typeof ref === 'string') return ref;
  return ref.src ?? '';
}

export function resolveSeoImage(ref: SeoImageInput | null | undefined, fallbackAlt: string): { src: string; alt: string } {
  const src = getImageSrc(ref);
  const trimmedFallback = fallbackAlt.trim() || 'Image';
  if (typeof ref === 'string' || ref == null) {
    return { src, alt: trimmedFallback };
  }
  const alt = ref.alt?.trim();
  return { src, alt: alt || trimmedFallback };
}

/** Accept DB / CMS values: string, { src, alt? }, or invalid → null */
export function coerceSeoImageField(value: unknown): SeoImageInput | null {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value && typeof value === 'object' && 'src' in value) {
    const src = String((value as { src: unknown }).src ?? '').trim();
    if (!src) return null;
    const altRaw = (value as { alt?: unknown }).alt;
    const alt = typeof altRaw === 'string' && altRaw.trim() ? altRaw.trim() : undefined;
    return alt !== undefined ? { src, alt } : { src };
  }
  return null;
}

export function coerceGalleryField(value: unknown, fallback: unknown, max = 3): SeoImageInput[] {
  const parse = (arr: unknown): SeoImageInput[] => {
    if (!Array.isArray(arr)) return [];
    const out: SeoImageInput[] = [];
    for (const entry of arr) {
      const c = coerceSeoImageField(entry);
      if (c) out.push(c);
      if (out.length >= max) break;
    }
    return out;
  };
  const primary = parse(value);
  if (primary.length > 0) return primary;
  return parse(fallback);
}
