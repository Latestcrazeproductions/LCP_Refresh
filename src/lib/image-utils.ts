const DEFAULT_SUPABASE_WIDTH = 1600;
const DEFAULT_SUPABASE_QUALITY = 72;

export function getOptimizedImageUrl(
  src: string | null | undefined,
  options: { width?: number; quality?: number } = {}
) {
  if (!src) {
    return src ?? '';
  }

  if (!src.includes('/storage/v1/object/public/')) {
    return src;
  }

  const width = options.width ?? DEFAULT_SUPABASE_WIDTH;
  const quality = options.quality ?? DEFAULT_SUPABASE_QUALITY;

  try {
    const url = new URL(src);
    url.pathname = url.pathname.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    url.searchParams.set('width', String(width));
    url.searchParams.set('quality', String(quality));
    url.searchParams.set('resize', 'contain');
    return url.toString();
  } catch {
    return src;
  }
}
