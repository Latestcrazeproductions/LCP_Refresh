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

const LIVE_PATHS = new Set([
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
]);

const SERVICE_SLUGS = [
  'event-production',
  'conference-production',
  'av-production',
  'led-walls',
  'event-lighting',
  'staging',
  'audio-systems',
];

for (const slug of SERVICE_SLUGS) {
  LIVE_PATHS.add(`/services/${slug}`);
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

function parsePages(xml) {
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
    const slug = body.match(/<slug>([^<]+)<\/slug>/)?.[1]?.trim() ?? '';
    const title = body.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? '';
    const keyword = body.match(/<keyword>([^<]*)<\/keyword>/)?.[1]?.trim() ?? '';
    const url = slug.startsWith('/') ? slug : `/${slug}`;
    const type = inferType(pattern, layer);
    const track = inferTrack(type, pattern);
    const phase = inferPhase(tier, layer);
    const live = LIVE_PATHS.has(url) || status === 'live';

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

function main() {
  if (!fs.existsSync(MATRIX_PATH)) {
    console.error('Missing', MATRIX_PATH);
    process.exit(1);
  }
  const xml = fs.readFileSync(MATRIX_PATH, 'utf8');
  const pages = parsePages(xml);

  // Ensure key Phase 1 URLs exist even if not in matrix feeds paths
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
    {
      url: '/work/night-of-hope',
      layer: 'national',
      type: 'case_study',
      keyword: 'corporate gala production',
      title: 'Night of Hope Case Study',
      track: 'B',
      tier: 'monthly',
      phase: 1,
      lastUpdated: null,
      nextAction: 'create',
      implementationStatus: 'planned',
    },
    {
      url: '/resources/event-production-checklist',
      layer: 'national',
      type: 'tool',
      keyword: 'event production checklist',
      title: 'Event Production Checklist',
      track: 'B',
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

  const lines = [...byUrl.values()].map((p) => JSON.stringify(p));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, lines.join('\n') + '\n');
  console.log(`Wrote ${lines.length} records to ${OUT_PATH}`);
}

main();
