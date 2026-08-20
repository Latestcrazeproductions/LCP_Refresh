#!/usr/bin/env node
/**
 * Upsert one or more page records into content-registry/pages.jsonl by URL.
 *
 * Usage:
 *   npm run registry:upsert -- --url=/blog/my-slug --title="My Title" --type=blog --track=A
 *   npm run registry:upsert -- --json='{"url":"/work/x","title":"X","type":"case_study","track":"B"}'
 *
 * Prefer this over hand-editing the end of pages.jsonl (reduces merge conflicts).
 */
import { getRegistryPaths, upsertAndSavePages } from './registry.js';
import type { PageRecord, Track } from './types.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');

function parseArgs(argv: string[]): Array<Partial<PageRecord> & { url: string }> {
  let jsonRaw: string | undefined;
  const fields: Record<string, string> = {};

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json' && argv[i + 1]) {
      jsonRaw = argv[++i];
    } else if (a.startsWith('--') && a.includes('=')) {
      const [key, ...rest] = a.slice(2).split('=');
      fields[key] = rest.join('=');
    } else if (a.startsWith('--') && argv[i + 1]) {
      fields[a.slice(2)] = argv[++i];
    }
  }

  if (jsonRaw) {
    const parsed = JSON.parse(jsonRaw) as Partial<PageRecord> & { url: string };
    if (!parsed.url) throw new Error('--json object must include url');
    return [parsed];
  }

  if (!fields.url) {
    throw new Error('Provide --url=/path or --json={...}');
  }

  const update: Partial<PageRecord> & { url: string } = { url: fields.url };
  if (fields.title !== undefined) update.title = fields.title;
  if (fields.keyword !== undefined) update.keyword = fields.keyword;
  if (fields.type !== undefined) update.type = fields.type;
  if (fields.track !== undefined) update.track = fields.track as Track;
  if (fields.tier !== undefined) update.tier = fields.tier;
  if (fields.layer !== undefined) update.layer = fields.layer as PageRecord['layer'];
  if (fields.phase !== undefined) update.phase = Number(fields.phase);
  if (fields.lastUpdated !== undefined) update.lastUpdated = fields.lastUpdated;
  if (fields.nextAction !== undefined) update.nextAction = fields.nextAction;
  if (fields.implementationStatus !== undefined) {
    update.implementationStatus = fields.implementationStatus as PageRecord['implementationStatus'];
  } else {
    update.implementationStatus = 'live';
  }
  if (!update.lastUpdated) {
    update.lastUpdated = new Date().toISOString().slice(0, 10);
  }

  return [update];
}

try {
  const updates = parseArgs(process.argv);
  const paths = getRegistryPaths(REPO_ROOT);
  const pages = upsertAndSavePages(paths, updates);
  for (const update of updates) {
    const saved = pages.find((p) => p.url === update.url);
    console.log(JSON.stringify({ ok: true, url: update.url, record: saved }, null, 2));
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
