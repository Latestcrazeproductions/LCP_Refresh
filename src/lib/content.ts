import { unstable_cache } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/server';
import { siteContent } from '@/content/site-content';
import {
  coerceGalleryField,
  coerceSeoImageField,
  getImageSrc,
  type SeoImageInput,
} from '@/lib/seo-image';

export type { SeoImageInput } from '@/lib/seo-image';

export type SiteContentKey =
  | 'brand'
  | 'hero'
  | 'about'
  | 'featuredVideo'
  | 'work'
  | 'services'
  | 'eventTypes'
  | 'contact'
  | 'faq';

export type ServiceItem = Omit<(typeof siteContent.services.items)[number], 'image'> & {
  image: SeoImageInput;
  gallery?: SeoImageInput[];
};

export type EventTypeItem = Omit<(typeof siteContent.eventTypes.items)[number], 'image'> & {
  image: SeoImageInput;
  gallery?: SeoImageInput[];
};

export type SiteContent = typeof siteContent;

/** Mutable version for CMS form state - all string fields editable */
export type EditableSiteContent = {
  brand: { name: string; nameFull: string; logo: string | null; logoDark: string | null; logoHeight: number };
  hero: { eyebrow: string; headline: string; subhead: string; images: string[] };
  about: {
    headline: string;
    lead: string;
    sections: Array<{ title: string; body: string }>;
  };
  featuredVideo: { youtubeUrl: string };
  work: {
    clientsLabel: string;
    clients: Array<{ type: 'text'; value: string } | { type: 'logo'; src: string; alt: string }>;
    projects: Array<{ id: number; title: string; category: string; image: string; size: string }>;
    projectsTitle: string;
    projectsSubhead: string;
  };
  services: {
    sectionTitle: string;
    sectionSubhead: string;
    items: Array<{
      id: string;
      iconKey: string;
      title: string;
      description: string;
      image: string;
      /** Optional SEO description for the main image (stored merged into image on save/read). */
      imageAlt?: string;
      gallery?: string[];
      details?: {
        headline: string;
        text: string;
        features: string[];
      };
    }>;
  };
  eventTypes: {
    sectionTitle: string;
    sectionSubhead: string;
    items: Array<{
      id: string;
      iconKey?: string;
      title: string;
      description: string;
      image: string;
      imageAlt?: string;
      gallery?: string[];
      details?: { headline: string; text: string; features: string[] };
    }>;
  };
  contact: {
    headline: string;
    subhead: string;
    email: string;
    phone: string;
    address: string;
    image: string | null;
    /** Optional alt for contact section image (merged with image on read). */
    imageAlt?: string;
    ctaText: string;
    copyright: string;
    footerLinks: Array<{ label: string; href: string }>;
  };
  faq: {
    sectionTitle: string;
    items: Array<{ question: string; answer: string }>;
  };
};

function mergeSeoMainImage(
  item: Record<string, unknown>,
  fallback: Record<string, unknown> | undefined,
  placeholder: string
): SeoImageInput {
  const coerced = coerceSeoImageField(item.image);
  const coercedFb = coerceSeoImageField(fallback?.image);
  const strItem = typeof item.image === 'string' && item.image.trim() ? item.image.trim() : '';
  const strFb =
    typeof fallback?.image === 'string' && fallback.image.trim() ? (fallback.image as string).trim() : '';

  const base: SeoImageInput =
    coerced ?? (strItem || null) ?? coercedFb ?? (strFb || null) ?? placeholder;

  const cmsAlt = typeof item.imageAlt === 'string' ? item.imageAlt.trim() : '';
  if (cmsAlt) {
    return { src: getImageSrc(base), alt: cmsAlt };
  }
  return base;
}

/** Deep merge DB values onto defaults; ensures valid structure */
export function mergeContent(
  fromDb: Partial<Record<SiteContentKey, unknown>>
): SiteContent {
  const dbBrand = fromDb.brand as Partial<SiteContent['brand']> | undefined;
  const logoHeight =
    typeof dbBrand?.logoHeight === 'number'
      ? dbBrand.logoHeight
      : siteContent.brand.logoHeight;

  const brand: SiteContent['brand'] = dbBrand
    ? {
        ...siteContent.brand,
        ...dbBrand,
        logoHeight,
        name: dbBrand.name ?? siteContent.brand.name,
        nameFull: dbBrand.nameFull ?? siteContent.brand.nameFull,
        logo: dbBrand.logo ?? siteContent.brand.logo,
        logoDark: dbBrand.logoDark ?? siteContent.brand.logoDark,
      }
    : siteContent.brand;

  const rawHeroImages = (fromDb.hero as Partial<SiteContent['hero']>)?.images;
  const heroImages: SeoImageInput[] =
    Array.isArray(rawHeroImages) && rawHeroImages.length > 0
      ? rawHeroImages
          .map((entry) =>
            coerceSeoImageField(entry) ??
            (typeof entry === 'string' && entry.trim() ? entry.trim() : null)
          )
          .filter((x): x is SeoImageInput => Boolean(x))
      : [...siteContent.hero.images];

  const hero: SiteContent['hero'] = {
    ...siteContent.hero,
    ...(fromDb.hero as Partial<SiteContent['hero']>),
    images: heroImages as unknown as SiteContent['hero']['images'],
  };

  const about: SiteContent['about'] = {
    ...siteContent.about,
    ...(fromDb.about as Partial<SiteContent['about']>),
    sections: Array.isArray((fromDb.about as SiteContent['about'])?.sections)
      ? ((fromDb.about as SiteContent['about'])?.sections as SiteContent['about']['sections'])
      : siteContent.about.sections,
  };

  const featuredVideo: SiteContent['featuredVideo'] = {
    ...siteContent.featuredVideo,
    ...(fromDb.featuredVideo as Partial<SiteContent['featuredVideo']>),
    youtubeUrl: ((fromDb.featuredVideo as SiteContent['featuredVideo'])?.youtubeUrl?.trim() || siteContent.featuredVideo.youtubeUrl) as SiteContent['featuredVideo']['youtubeUrl'],
  };

  const work: SiteContent['work'] = {
    ...siteContent.work,
    ...(fromDb.work as Partial<SiteContent['work']>),
    clients: Array.isArray((fromDb.work as SiteContent['work'])?.clients)
      ? ((fromDb.work as SiteContent['work']).clients as SiteContent['work']['clients'])
      : siteContent.work.clients,
    projects: Array.isArray((fromDb.work as SiteContent['work'])?.projects)
      ? ((fromDb.work as SiteContent['work']).projects as SiteContent['work']['projects'])
      : siteContent.work.projects,
  };

  const dbItems = (fromDb.services as SiteContent['services'])?.items;
  const defaultItems = siteContent.services.items;
  const PLACEHOLDER_IMAGE =
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop';
  const mergedItems = (Array.isArray(dbItems)
    ? dbItems.map((item, i) => {
        const fallback = defaultItems[i] as Record<string, unknown> | undefined;
        const image = mergeSeoMainImage(
          item as Record<string, unknown>,
          fallback,
          PLACEHOLDER_IMAGE
        );
        const gallery = coerceGalleryField(
          (item as { gallery?: unknown }).gallery,
          fallback?.gallery,
          3
        );
        const merged = {
          ...(fallback ?? item),
          ...item,
          image,
          gallery,
        } as Record<string, unknown>;
        delete merged.imageAlt;
        return merged;
      })
    : defaultItems.map((item) => ({
        ...item,
        gallery: coerceGalleryField(
          (item as { gallery?: unknown }).gallery,
          undefined,
          3
        ),
      }))) as unknown as SiteContent['services']['items'];

  const services: SiteContent['services'] = {
    ...siteContent.services,
    ...(fromDb.services as Partial<SiteContent['services']>),
    items: mergedItems,
  };

  const dbEventItems = (fromDb.eventTypes as SiteContent['eventTypes'])?.items;
  const defaultEventItems = siteContent.eventTypes.items;
  const EVENT_PLACEHOLDER =
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop';
  const mergedEventItems = (Array.isArray(dbEventItems)
    ? dbEventItems.map((item, i) => {
        const fallback = defaultEventItems[i] as Record<string, unknown> | undefined;
        const image = mergeSeoMainImage(
          item as Record<string, unknown>,
          fallback,
          EVENT_PLACEHOLDER
        );
        const gallery = coerceGalleryField(
          (item as { gallery?: unknown }).gallery,
          fallback?.gallery,
          3
        );
        const merged = {
          ...(fallback ?? item),
          ...item,
          image,
          gallery,
        } as Record<string, unknown>;
        delete merged.imageAlt;
        return merged;
      })
    : defaultEventItems.map((item) => ({
        ...item,
        gallery: coerceGalleryField((item as { gallery?: unknown }).gallery, undefined, 3),
      }))) as SiteContent['eventTypes']['items'];

  const eventTypes: SiteContent['eventTypes'] = {
    ...siteContent.eventTypes,
    ...(fromDb.eventTypes as Partial<SiteContent['eventTypes']>),
    items: mergedEventItems,
  };

  const contactDb = fromDb.contact as (Partial<SiteContent['contact']> & { imageAlt?: string }) | undefined;
  const mergedContactImage = mergeSeoMainImage(
    {
      image: contactDb?.image ?? siteContent.contact.image,
      imageAlt: contactDb?.imageAlt,
    },
    { image: siteContent.contact.image },
    String(siteContent.contact.image)
  );

  const contact: SiteContent['contact'] = {
    ...siteContent.contact,
    ...contactDb,
    image: mergedContactImage as unknown as SiteContent['contact']['image'],
    footerLinks: Array.isArray((fromDb.contact as SiteContent['contact'])?.footerLinks)
      ? ((fromDb.contact as SiteContent['contact']).footerLinks as SiteContent['contact']['footerLinks'])
      : siteContent.contact.footerLinks,
  };
  delete (contact as { imageAlt?: unknown }).imageAlt;

  const faq: SiteContent['faq'] = {
    ...siteContent.faq,
    ...(fromDb.faq as Partial<SiteContent['faq']> | undefined),
  };

  return { brand, hero, about, featuredVideo, work, services, eventTypes, contact, faq };
}

/** Fetch site content from Supabase, falling back to static site-content.ts */
const getCachedSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return siteContent as SiteContent;
    }
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase.from('site_content').select('key, value');

      if (error || !data?.length) {
        return siteContent as SiteContent;
      }

      const fromDb = Object.fromEntries(
        data.map((row: { key: string; value: unknown }) => [row.key, row.value])
      ) as Partial<Record<SiteContentKey, unknown>>;

      return mergeContent(fromDb);
    } catch {
      return siteContent as SiteContent;
    }
  },
  ['site-content'],
  {
    revalidate: 3600,
    tags: ['site-content'],
  }
);

export async function getSiteContent(): Promise<SiteContent> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return siteContent as SiteContent;
  }
  return getCachedSiteContent();
}
