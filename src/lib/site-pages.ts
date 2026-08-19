import fs from 'node:fs';
import path from 'node:path';
import { getSiteContent } from '@/lib/content';
import { listMarkdownPages } from '@/lib/markdown-pages';

export type SitePageEntry = {
  path: string;
  title: string;
  lastModified?: string;
};

export type SitePageGroup = {
  id: string;
  label: string;
  pages: SitePageEntry[];
};

const CORE_PAGES: SitePageEntry[] = [
  { path: '/', title: 'Home' },
  { path: '/services', title: 'Services' },
  { path: '/events', title: 'Events' },
  { path: '/blog', title: 'Blog' },
  { path: '/work', title: 'Case studies' },
  { path: '/resources', title: 'Resources' },
  { path: '/about', title: 'About' },
  { path: '/contact', title: 'Contact' },
  { path: '/featured-venues', title: 'Featured venues' },
  { path: '/digital-signage', title: 'Digital signage' },
];

const MARKET_PAGES: SitePageEntry[] = [
  { path: '/phoenix-av-production', title: 'Phoenix AV production' },
];

const LEGAL_PAGES: SitePageEntry[] = [
  { path: '/privacy', title: 'Privacy policy' },
  { path: '/terms', title: 'Terms of use' },
];

function hasNationwideHub(): boolean {
  const hubPage = path.join(process.cwd(), 'src/app/nationwide-event-production/page.tsx');
  return fs.existsSync(hubPage);
}

/** All routable marketing pages — same sources as sitemap.xml, with human titles. */
export async function getSitePageIndex(): Promise<SitePageGroup[]> {
  const content = await getSiteContent();

  const hubs: SitePageEntry[] = [];
  if (hasNationwideHub()) {
    hubs.push({ path: '/nationwide-event-production', title: 'Nationwide event production' });
  }

  const services: SitePageEntry[] = (content?.services?.items ?? []).map((item) => ({
    path: `/services/${item.id}`,
    title: item.title,
  }));

  const events: SitePageEntry[] = (content?.eventTypes?.items ?? []).map((item) => ({
    path: `/events/${item.id}`,
    title: item.title,
  }));

  const blogs: SitePageEntry[] = listMarkdownPages('blogs').map((page) => ({
    path: `/blog/${page.slug}`,
    title: page.title,
    lastModified: page.dateModified,
  }));

  const work: SitePageEntry[] = listMarkdownPages('work').map((page) => ({
    path: `/work/${page.slug}`,
    title: page.title,
    lastModified: page.dateModified,
  }));

  const resources: SitePageEntry[] = listMarkdownPages('resources').map((page) => ({
    path: `/resources/${page.slug}`,
    title: page.title,
    lastModified: page.dateModified,
  }));

  const groups: SitePageGroup[] = [
    { id: 'core', label: 'Core', pages: CORE_PAGES },
    ...(hubs.length ? [{ id: 'hubs', label: 'National hubs', pages: hubs }] : []),
    { id: 'services', label: 'Services', pages: services },
    { id: 'events', label: 'Event types', pages: events },
    { id: 'blog', label: 'Blog', pages: blogs },
    { id: 'work', label: 'Case studies', pages: work },
    { id: 'resources', label: 'Resources', pages: resources },
    { id: 'markets', label: 'Markets', pages: MARKET_PAGES },
    { id: 'legal', label: 'Legal', pages: LEGAL_PAGES },
  ];

  return groups.filter((group) => group.pages.length > 0);
}

export function flattenSitePages(groups: SitePageGroup[]): SitePageEntry[] {
  return groups.flatMap((group) => group.pages);
}

export function sitePagesToSitemapEntries(
  groups: SitePageGroup[],
  baseUrl: string,
  lastmod: string
): Array<{ url: string; lastmod: string; changefreq: string; priority: number }> {
  const priorityForPath = (pathname: string): number => {
    if (pathname === '/') return 1;
    if (pathname === '/contact' || pathname.startsWith('/services') || pathname.startsWith('/events'))
      return 0.9;
    if (pathname === '/nationwide-event-production') return 0.9;
    if (pathname.startsWith('/blog') || pathname.startsWith('/work')) return 0.75;
    if (pathname.startsWith('/resources')) return 0.7;
    if (pathname === '/privacy' || pathname === '/terms') return 0.5;
    return 0.8;
  };

  return flattenSitePages(groups).map((page) => ({
    url: `${baseUrl}${page.path === '/' ? '' : page.path}`,
    lastmod: page.lastModified ? `${page.lastModified}T12:00:00Z` : lastmod,
    changefreq: page.path.startsWith('/blog') ? 'weekly' : 'monthly',
    priority: priorityForPath(page.path),
  }));
}
