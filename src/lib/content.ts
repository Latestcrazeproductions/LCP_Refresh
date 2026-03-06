import { createClient } from '@/lib/supabase/server';
import { siteContent } from '@/content/site-content';

export type SiteContentKey = 'brand' | 'hero' | 'work' | 'services' | 'contact';

export type ServiceItem = (typeof siteContent.services.items)[number];

export type SiteContent = typeof siteContent;

/** Mutable version for CMS form state - all string fields editable */
export type EditableSiteContent = {
  brand: { name: string; nameFull: string; logo: string | null; logoDark: string | null; logoHeight: number };
  hero: { eyebrow: string; headline: string; subhead: string; images: string[] };
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
      details?: {
        headline: string;
        text: string;
        features: string[];
      };
    }>;
  };
  contact: {
    headline: string;
    subhead: string;
    email: string;
    phone: string;
    address: string;
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

  const services: SiteContent['services'] = {
    ...siteContent.services,
    ...(fromDb.services as Partial<SiteContent['services']>),
    items: Array.isArray((fromDb.services as SiteContent['services'])?.items)
      ? ((fromDb.services as SiteContent['services']).items as SiteContent['services']['items'])
      : siteContent.services.items,
  };

  const contact: SiteContent['contact'] = {
    ...siteContent.contact,
    ...(fromDb.contact as Partial<SiteContent['contact']>),
    footerLinks: Array.isArray((fromDb.contact as SiteContent['contact'])?.footerLinks)
      ? ((fromDb.contact as SiteContent['contact']).footerLinks as SiteContent['contact']['footerLinks'])
      : siteContent.contact.footerLinks,
  };

  return { brand, hero, work, services, contact };
}

/** Fetch site content from Supabase, falling back to static site-content.ts */
export async function getSiteContent(): Promise<SiteContent> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return siteContent as SiteContent;
  }
  try {
    const supabase = await createClient();
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
}
