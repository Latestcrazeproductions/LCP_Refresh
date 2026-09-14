import fs from 'node:fs';
import path from 'node:path';

export interface FeedRegistryEntry {
  url: string;
  layer: string;
  type: string;
  keyword: string;
  title: string;
  track: string;
  tier: string;
  phase: number;
  pattern: string;
  implementationStatus: string;
}

/** Head-term hubs that are indexable. Do not expand to the full matrix from here. */
export const FEED_INDEXABLE_PATHS = [
  '/feeds/event-production',
  '/feeds/av-production',
  '/feeds/led-walls',
] as const;

/** Layout previews — remain noindex. */
export const FEED_PREVIEW_PATHS = [
  '/feeds/av-production-galas-awards',
  '/feeds/av-production/phoenix-az',
] as const;

export const FEED_ROUTABLE_PATHS = [...FEED_INDEXABLE_PATHS, ...FEED_PREVIEW_PATHS] as const;

const REGISTRY_PATH = path.join(process.cwd(), 'content-registry/pages.jsonl');

let cache: Map<string, FeedRegistryEntry> | null = null;

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function loadRegistry(): Map<string, FeedRegistryEntry> {
  if (cache) return cache;
  cache = new Map();
  if (!fs.existsSync(REGISTRY_PATH)) return cache;

  const lines = fs.readFileSync(REGISTRY_PATH, 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      const row = JSON.parse(line) as FeedRegistryEntry;
      if (!row.url?.startsWith('/feeds/')) continue;
      cache.set(row.url, {
        ...row,
        title: decodeEntities(row.title),
        keyword: decodeEntities(row.keyword),
      });
    } catch {
      // skip malformed lines
    }
  }
  return cache;
}

export function feedPathFromSlug(slug: string[] | undefined): string {
  if (!slug?.length) return '/feeds';
  return `/feeds/${slug.join('/')}`;
}

export function getFeedEntry(feedPath: string): FeedRegistryEntry | null {
  return loadRegistry().get(feedPath) ?? null;
}

export function slugFromFeedPath(feedPath: string): string[] {
  return feedPath.replace(/^\/feeds\/?/, '').split('/').filter(Boolean);
}

export function isFeedIndexable(feedPath: string): boolean {
  return (FEED_INDEXABLE_PATHS as readonly string[]).includes(feedPath);
}

export function isFeedRoutable(feedPath: string): boolean {
  return (FEED_ROUTABLE_PATHS as readonly string[]).includes(feedPath);
}

export function listFeedPreviewEntries(): FeedRegistryEntry[] {
  const registry = loadRegistry();
  return FEED_ROUTABLE_PATHS.map((url) => registry.get(url)).filter(
    (entry): entry is FeedRegistryEntry => entry !== undefined
  );
}
