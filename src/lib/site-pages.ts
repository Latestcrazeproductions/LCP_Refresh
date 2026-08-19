import fs from 'node:fs';
import path from 'node:path';
import { getSiteContent } from '@/lib/content';
import { getMarkdownPage, listMarkdownPages } from '@/lib/markdown-pages';

export type SitePageEntry = {
  path: string;
  title: string;
  lastModified?: string;
  track?: string;
  type?: string;
};

export type SitePageGroup = {
  id: string;
  label: string;
  pages: SitePageEntry[];
};

const REGISTRY_PATH = path.join(process.cwd(), 'content-registry/pages.jsonl');

/** Registry types owned by the inbound demand engine (not pre-existing site shell). */
const DEMAND_ENGINE_TYPES = new Set([
  'hub',
  'blog',
  'case_study',
  'tool',
  'strategy',
  'venue_guide',
  'index',
  'geo_landing',
]);

/** Live URLs that predate the demand engine but share a registry type. */
const PRE_DEMAND_ENGINE_URLS = new Set(['/phoenix-av-production']);

const GROUP_LABELS: Record<string, string> = {
  hub: 'National hubs',
  blog: 'Capture blogs',
  case_study: 'Case studies',
  tool: 'Planning tools',
  strategy: 'Strategy blogs',
  venue_guide: 'Venue guides',
  index: 'Indexes',
  geo_landing: 'Geo markets',
};

const GROUP_ORDER = ['hub', 'blog', 'strategy', 'case_study', 'tool', 'venue_guide', 'index', 'geo_landing'];

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

interface RegistryPage {
  url: string;
  type: string;
  title?: string;
  keyword?: string;
  track?: string;
  lastUpdated?: string | null;
  implementationStatus?: 'live' | 'planned';
}

function loadRegistryPages(): RegistryPage[] {
  if (!fs.existsSync(REGISTRY_PATH)) return [];
  return fs
    .readFileSync(REGISTRY_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as RegistryPage);
}

function hasNationwideHub(): boolean {
  const hubPage = path.join(process.cwd(), 'src/app/nationwide-event-production/page.tsx');
  return fs.existsSync(hubPage);
}

function titleFromMarkdown(url: string): { title?: string; lastModified?: string } {
  if (url.startsWith('/blog/')) {
    const page = getMarkdownPage('blogs', url.slice('/blog/'.length));
    return { title: page?.title, lastModified: page?.dateModified };
  }
  if (url.startsWith('/work/')) {
    const page = getMarkdownPage('work', url.slice('/work/'.length));
    return { title: page?.title, lastModified: page?.dateModified };
  }
  if (url.startsWith('/resources/')) {
    const page = getMarkdownPage('resources', url.slice('/resources/'.length));
    return { title: page?.title, lastModified: page?.dateModified };
  }
  return {};
}

function resolveTitle(record: RegistryPage): string {
  if (record.title?.trim()) return record.title.trim();
  const fromMd = titleFromMarkdown(record.url);
  if (fromMd.title) return fromMd.title;
  if (record.keyword?.trim()) return record.keyword.trim();
  const slug = record.url.split('/').filter(Boolean).pop();
  return slug ? slug.replace(/-/g, ' ') : record.url;
}

function resolveLastModified(record: RegistryPage): string | undefined {
  const fromMd = titleFromMarkdown(record.url);
  return fromMd.lastModified ?? record.lastUpdated ?? undefined;
}

/** Live pages published by the inbound demand engine (from content-registry). */
export function getDemandEnginePageIndex(): SitePageGroup[] {
  const live = loadRegistryPages().filter(
    (page) =>
      page.implementationStatus === 'live' &&
      DEMAND_ENGINE_TYPES.has(page.type) &&
      !PRE_DEMAND_ENGINE_URLS.has(page.url)
  );

  const byType = new Map<string, SitePageEntry[]>();
  for (const record of live) {
    const entry: SitePageEntry = {
      path: record.url,
      title: resolveTitle(record),
      lastModified: resolveLastModified(record),
      track: record.track,
      type: record.type,
    };
    const list = byType.get(record.type) ?? [];
    list.push(entry);
    byType.set(record.type, list);
  }

  return GROUP_ORDER.filter((type) => byType.has(type)).map((type) => ({
    id: type,
    label: GROUP_LABELS[type] ?? type,
    pages: (byType.get(type) ?? []).sort((a, b) => a.title.localeCompare(b.title)),
  }));
}

/** All routable marketing pages — used by sitemap.xml. */
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
