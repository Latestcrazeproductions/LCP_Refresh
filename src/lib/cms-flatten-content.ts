/**
 * Client-safe: used by CMS editor only. Lives outside content.ts so we do not
 * pull server-only modules (Supabase) into the CMS client bundle.
 */
import type { EditableSiteContent, SiteContent } from '@/lib/content';
import { getImageSrc, type SeoImageInput } from '@/lib/seo-image';

/** Flatten SeoImageInput fields for CMS forms; preserves optional imageAlt for round-trip. */
export function flattenContentForCmsEditor(content: SiteContent): EditableSiteContent {
  const heroImages = (content.hero.images as unknown as SeoImageInput[]).map((img) => getImageSrc(img));

  const serviceItems: EditableSiteContent['services']['items'] = content.services.items.map((it) => {
    const row = it as { image: SeoImageInput; gallery?: SeoImageInput[] };
    const img = row.image;
    const imageStr = getImageSrc(img);
    const imageAlt =
      typeof img === 'object' && img && typeof img.alt === 'string' && img.alt.trim() ? img.alt.trim() : undefined;
    const gallery = (row.gallery ?? []).map((g) => getImageSrc(g as SeoImageInput));
    return {
      ...(it as unknown as EditableSiteContent['services']['items'][number]),
      image: imageStr,
      imageAlt: imageAlt || undefined,
      gallery,
    };
  });

  const eventItems: EditableSiteContent['eventTypes']['items'] = content.eventTypes.items.map((it) => {
    const row = it as { image: SeoImageInput; gallery?: SeoImageInput[] };
    const img = row.image;
    const imageStr = getImageSrc(img);
    const imageAlt =
      typeof img === 'object' && img && typeof img.alt === 'string' && img.alt.trim() ? img.alt.trim() : undefined;
    const gallery = (row.gallery ?? []).map((g) => getImageSrc(g as SeoImageInput));
    return {
      ...(it as unknown as EditableSiteContent['eventTypes']['items'][number]),
      image: imageStr,
      imageAlt: imageAlt || undefined,
      gallery,
    };
  });

  const cImg = content.contact.image as unknown as SeoImageInput | null | undefined;
  let contactImage: string | null = null;
  let contactImageAlt: string | undefined;
  if (cImg) {
    contactImage = getImageSrc(cImg) || null;
    if (typeof cImg === 'object' && typeof cImg.alt === 'string' && cImg.alt.trim()) {
      contactImageAlt = cImg.alt.trim();
    }
  }

  return {
    ...content,
    hero: { ...content.hero, images: heroImages },
    services: { ...content.services, items: serviceItems },
    eventTypes: { ...content.eventTypes, items: eventItems },
    contact: {
      ...content.contact,
      image: contactImage,
      imageAlt: contactImageAlt,
      footerLinks: [...content.contact.footerLinks],
    },
  } as unknown as EditableSiteContent;
}
