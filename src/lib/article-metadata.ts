import type { Metadata } from 'next';
import {
  extractFirstMarkdownImage,
  type MarkdownPage,
} from '@/lib/markdown-pages';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://latestcrazeproductions.com';

/** Production photo used when a page has no item image (iMessage / social previews). */
export const DEFAULT_OG_IMAGE = {
  url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
  width: 1200,
  height: 630,
  alt: 'Corporate event production with LED walls and stage lighting — Latest Craze Productions',
} as const;

export function absolutizeSiteUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  const path = src.startsWith('/') ? src : `/${src}`;
  return `${SITE_URL}${path}`;
}

export function resolveMarkdownShareImage(page: MarkdownPage): {
  src: string;
  alt: string;
  isItemImage: boolean;
} {
  const fromFrontmatter = page.image?.trim();
  if (fromFrontmatter) {
    return { src: fromFrontmatter, alt: page.title, isItemImage: true };
  }
  const fromBody = extractFirstMarkdownImage(page.body);
  if (fromBody) {
    return { src: fromBody.src, alt: fromBody.alt || page.title, isItemImage: true };
  }
  return {
    src: DEFAULT_OG_IMAGE.url,
    alt: `${page.title} — Latest Craze Productions`,
    isItemImage: false,
  };
}

export function twitterLargeImageFields(title: string, description: string, imageUrl: string, imageAlt?: string) {
  return {
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: DEFAULT_OG_IMAGE.width,
          height: DEFAULT_OG_IMAGE.height,
          alt: imageAlt ?? DEFAULT_OG_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildArticleMetadata(page: MarkdownPage, pathname: string): Metadata {
  const canonical = `${SITE_URL}${pathname}`;
  const shareImage = resolveMarkdownShareImage(page);
  const imageUrl = absolutizeSiteUrl(shareImage.src);
  const og = twitterLargeImageFields(page.title, page.description, imageUrl, shareImage.alt);

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      siteName: 'Latest Craze Productions',
      url: canonical,
      ...og.openGraph,
    },
    twitter: og.twitter,
  };
}
