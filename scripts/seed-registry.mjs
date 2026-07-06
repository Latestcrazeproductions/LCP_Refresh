#!/usr/bin/env node
/**
 * Seed content-registry/pages.jsonl from seo-page-matrix.xml + known live URLs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MATRIX_PATH = path.join(ROOT, 'public/seo-page-matrix.xml');
const OUT_PATH = path.join(ROOT, 'content-registry/pages.jsonl');
const LIBRARY = path.join(ROOT, 'content-library');

/** Paths that exist as static App Router pages or CMS-backed routes today */
const STATIC_LIVE_PATHS = [
  '/',
  '/services',
  '/events',
  '/about',
  '/contact',
  '/featured-venues',
  '/phoenix-av-production',
  '/digital-signage',
  '/privacy',
  '/terms',
  '/blog',
  '/work',
  '/resources',
];

/** Matches src/content/site-content.ts service IDs → /services/[slug] */
const SERVICE_SLUGS = ['led-walls', 'lighting', 'stage', 'audio', 'scenic', 'projection'];

/** Matches site-content eventTypes IDs */
const EVENT_SLUGS = [
  'corporate-keynotes',
  'product-launches',
  'galas-awards',
  'conferences',
  'brand-activations',
];

function buildLivePathSet() {
  const live = new Set(STATIC_LIVE_PATHS);
  for (const slug of SERVICE_SLUGS) live.add(`/services/${slug}`);
  for (const slug of EVENT_SLUGS) live.add(`/events/${slug}`);

  for (const [dir, prefix] of [
    ['blogs', '/blog'],
    ['work', '/work'],
    ['resources', '/resources'],
  ]) {
    const folder = path.join(LIBRARY, dir);
    if (!fs.existsSync(folder)) continue;
    for (const file of fs.readdirSync(folder)) {
      if (!file.endsWith('.md')) continue;
      live.add(`${prefix}/${file.replace(/\.md$/, '')}`);
    }
  }

  return live;
}

function inferTrack(type, pattern) {
  if (type === 'case_study' || type === 'tool' || pattern?.includes('strategy')) return 'B';
  return 'A';
}

function inferType(pattern, layer) {
  if (pattern?.includes('blog')) return 'blog';
  if (layer === 'geo') return 'geo_landing';
  if (pattern?.includes('head-service') || pattern?.includes('core-service')) return 'service';
  return 'landing';
}

function inferPhase(tier, layer) {
  const t = Number(tier);
  if (layer === 'geo' && t >= 5) return 2;
  if (t <= 2) return 1;
  return 2;
}

function parsePages(xml, livePaths) {
  const pages = [];
  const re = /<page\s+([^>]+)>([\s\S]*?)<\/page>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const attrs = m[1];
    const body = m[2];
    const tier = attrs.match(/tier="(\d+)"/)?.[1] ?? '7';
    const layer = attrs.match(/layer="(national|geo)"/)?.[1] ?? 'national';
    const pattern = attrs.match(/pattern="([^"]+)"/)?.[1] ?? '';
    const status = attrs.match(/status="([^"]+)"/)?.[1] ?? 'planned';
    const slug = body.match(/<slug>([^<]*)<\/slug>/)?.[1]?.trim() ?? '';
    const title = body.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? '';
    const keyword = body.match(/<keyword>([^<]*)<\/keyword>/)?.[1]?.trim() ?? '';
    const url = slug.startsWith('/') ? slug : `/${slug}`;
    const type = inferType(pattern, layer);
    const track = inferTrack(type, pattern);
    const phase = inferPhase(tier, layer);
    const live = livePaths.has(url) || status === 'live';

    pages.push({
      url,
      layer,
      type,
      keyword,
      title,
      track,
      tier: Number(tier) <= 2 ? 'monthly' : Number(tier) <= 4 ? 'quarterly' : 'weekly',
      phase,
      pattern,
      lastUpdated: live ? '2026-06-01' : null,
      nextAction: live ? 'faq_refresh' : 'create',
      implementationStatus: live ? 'live' : 'planned',
    });
  }
  return pages;
}

function liveRecord(base) {
  return {
    ...base,
    lastUpdated: '2026-06-01',
    nextAction: 'faq_refresh',
    implementationStatus: 'live',
  };
}

function main() {
  if (!fs.existsSync(MATRIX_PATH)) {
    console.error('Missing', MATRIX_PATH);
    process.exit(1);
  }

  const livePaths = buildLivePathSet();
  const xml = fs.readFileSync(MATRIX_PATH, 'utf8');
  const pages = parsePages(xml, livePaths);

  const extras = [
    {
      url: '/nationwide-event-production',
      layer: 'national',
      type: 'hub',
      keyword: 'nationwide event production',
      title: 'Nationwide Event Production',
      track: 'A',
      tier: 'quarterly',
      phase: 1,
      lastUpdated: null,
      nextAction: 'create',
      implementationStatus: 'planned',
    },
    {
      url: '/markets',
      layer: 'national',
      type: 'index',
      keyword: 'event production markets',
      title: 'Markets We Serve',
      track: 'A',
      tier: 'quarterly',
      phase: 1,
      lastUpdated: null,
      nextAction: 'create',
      implementationStatus: 'planned',
    },
  ];

  const byUrl = new Map(pages.map((p) => [p.url, p]));
  for (const e of extras) {
    if (!byUrl.has(e.url)) byUrl.set(e.url, e);
  }

  // Ensure every discovered live path has a registry row
  for (const url of livePaths) {
    if (byUrl.has(url)) {
      const row = byUrl.get(url);
      if (row.implementationStatus !== 'live') {
        byUrl.set(url, liveRecord(row));
      }
      continue;
    }
    let type = 'landing';
    let layer = 'national';
    let track = 'A';
    if (url.startsWith('/blog/')) {
      type = 'blog';
      track = 'A';
    } else if (url.startsWith('/work/')) {
      type = 'case_study';
      track = 'B';
    } else if (url.startsWith('/resources/')) {
      type = 'tool';
      track = 'B';
    } else if (url.startsWith('/services/')) {
      type = 'service';
    } else if (url.startsWith('/events/')) {
      type = 'event';
    } else if (url === '/phoenix-av-production') {
      type = 'geo_landing';
      layer = 'geo';
    }

    byUrl.set(
      url,
      liveRecord({
        url,
        layer,
        type,
        keyword: '',
        title: '',
        track,
        tier: 'monthly',
        phase: 1,
      })
    );
  }

  const all = [...byUrl.values()];
  const liveCount = all.filter((p) => p.implementationStatus === 'live').length;
  const lines = all.map((p) => JSON.stringify(p));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, lines.join('\n') + '\n');
  console.log(`Wrote ${lines.length} records (${liveCount} live) to ${OUT_PATH}`);
}

main();
