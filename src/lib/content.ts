import { unstable_cache } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/server';
import { siteContent } from '@/content/site-content';

export type SiteContentKey = 'brand' | 'hero' | 'featuredVideo' | 'work' | 'services' | 'eventTypes' | 'faq' | 'contact';

export type ServiceItem = (typeof siteContent.services.items)[number] & { gallery?: string[] };
export type EventTypeItem = (typeof siteContent.eventTypes.items)[number] & { gallery?: string[] };

export type SiteContent = typeof siteContent;

/** Mutable version for CMS form state - all string fields editable */
export type EditableSiteContent = {
  brand: { name: string; nameFull: string; logo: string | null; logoDark: string | null; logoHeight: number };
  hero: { eyebrow: string; headline: string; subhead: string; images: string[] };
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
      gallery?: string[];
      details?: { headline: string; text: string; features: string[] };
    }>;
  };
  faq: {
    sectionTitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  contact: {
    headline: string;
    subhead: string;
    email: string;
    phone: string;
    address: string;
    image: string | null;
    ctaText: string;
    copyright: string;
    footerLinks: Array<{ label: string; href: string }>;
  };
};

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

  const hero: SiteContent['hero'] = {
    ...siteContent.hero,
    ...(fromDb.hero as Partial<SiteContent['hero']>),
    images: Array.isArray((fromDb.hero as SiteContent['hero'])?.images)
      ? ((fromDb.hero as SiteContent['hero']).images as string[])
      : siteContent.hero.images,
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
        const fallback = defaultItems[i];
        const image =
          item.image?.trim() || fallback?.image?.trim() || PLACEHOLDER_IMAGE;
        const dbGallery = Array.isArray(item.gallery) ? item.gallery.slice(0, 3).filter(Boolean) : [];
        const defaultGallery = Array.isArray(fallback?.gallery) ? (fallback.gallery as string[]).slice(0, 3).filter(Boolean) : [];
        const gallery = dbGallery.length > 0 ? dbGallery : defaultGallery;
        return {
          ...(fallback ?? item),
          ...item,
          image,
          gallery,
        };
      })
    : defaultItems.map((item) => ({ ...item, gallery: (item as { gallery?: string[] }).gallery ?? [] }))) as unknown as SiteContent['services']['items'];

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
        const fallback = defaultEventItems[i];
        const image =
          item.image?.trim() || fallback?.image?.trim() || EVENT_PLACEHOLDER;
        const dbGallery = Array.isArray(item.gallery) ? item.gallery.slice(0, 3).filter(Boolean) : [];
        const defaultGallery = Array.isArray(fallback?.gallery) ? (fallback.gallery as string[]).slice(0, 3).filter(Boolean) : [];
        const gallery = dbGallery.length > 0 ? dbGallery : defaultGallery;
        return { ...(fallback ?? item), ...item, image, gallery };
      })
    : defaultEventItems.map((item) => ({ ...item, gallery: (item.gallery ?? []) }))) as SiteContent['eventTypes']['items'];

  const eventTypes: SiteContent['eventTypes'] = {
    ...siteContent.eventTypes,
    ...(fromDb.eventTypes as Partial<SiteContent['eventTypes']>),
    items: mergedEventItems,
  };

  const contact: SiteContent['contact'] = {
    ...siteContent.contact,
    ...(fromDb.contact as Partial<SiteContent['contact']>),
    footerLinks: Array.isArray((fromDb.contact as SiteContent['contact'])?.footerLinks)
      ? ((fromDb.contact as SiteContent['contact']).footerLinks as SiteContent['contact']['footerLinks'])
      : siteContent.contact.footerLinks,
  };

  const faq: SiteContent['faq'] = {
    ...siteContent.faq,
    ...(fromDb.faq as Partial<SiteContent['faq']>),
    items: Array.isArray((fromDb.faq as SiteContent['faq'])?.items)
      ? ((fromDb.faq as SiteContent['faq']).items as SiteContent['faq']['items'])
      : siteContent.faq.items,
  };

  return { brand, hero, featuredVideo, work, services, eventTypes, faq, contact };
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
