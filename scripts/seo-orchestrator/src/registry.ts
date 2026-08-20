import fs from 'node:fs';
import path from 'node:path';
import type {
  PageRecord,
  RegistryConfig,
  RotationState,
} from './types.js';

export interface RegistryPaths {
  root: string;
}

export function getRegistryPaths(repoRoot: string): RegistryPaths {
  return { root: path.join(repoRoot, 'content-registry') };
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

export function loadConfig(paths: RegistryPaths): RegistryConfig {
  return readJson(path.join(paths.root, 'config.json'));
}

export function loadRotation(paths: RegistryPaths): RotationState {
  return readJson(path.join(paths.root, 'rotation.json'));
}

export function saveRotation(paths: RegistryPaths, rotation: RotationState): void {
  fs.writeFileSync(
    path.join(paths.root, 'rotation.json'),
    JSON.stringify(rotation, null, 2) + '\n'
  );
}

export function loadPages(paths: RegistryPaths): PageRecord[] {
  const file = path.join(paths.root, 'pages.jsonl');
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as PageRecord);
}

export function savePages(paths: RegistryPaths, pages: PageRecord[]): void {
  const file = path.join(paths.root, 'pages.jsonl');
  const content = pages.map((p) => JSON.stringify(p)).join('\n') + '\n';
  fs.writeFileSync(file, content);
}

/**
 * Upsert page records by `url` — updates in place, appends new URLs at end.
 * Prefer this over hand-editing pages.jsonl so parallel agent PRs collide less.
 */
export function upsertPagesByUrl(
  pages: PageRecord[],
  updates: Array<Partial<PageRecord> & { url: string }>
): PageRecord[] {
  const next = [...pages];
  const indexByUrl = new Map(next.map((page, i) => [page.url, i]));

  for (const update of updates) {
    const url = update.url?.trim();
    if (!url) continue;
    const existingIndex = indexByUrl.get(url);
    if (existingIndex === undefined) {
      const created = {
        layer: 'national',
        type: 'blog',
        track: 'A',
        tier: 'monthly',
        phase: 1,
        implementationStatus: 'live',
        ...update,
        url,
      } as PageRecord;
      indexByUrl.set(url, next.length);
      next.push(created);
      continue;
    }
    next[existingIndex] = { ...next[existingIndex], ...update, url };
  }

  return next;
}

export function upsertAndSavePages(
  paths: RegistryPaths,
  updates: Array<Partial<PageRecord> & { url: string }>
): PageRecord[] {
  const pages = upsertPagesByUrl(loadPages(paths), updates);
  savePages(paths, pages);
  return pages;
}

export function loadJson<T>(paths: RegistryPaths, name: string): T {
  return readJson(path.join(paths.root, name));
}

export function isNationwideHubLive(pages: PageRecord[], hubUrl: string): boolean {
  const hub = pages.find((p) => p.url === hubUrl);
  return hub?.implementationStatus === 'live';
}

export function advanceRotationWeek(rotation: RotationState): RotationState {
  const nextWeek = rotation.week >= 4 ? 1 : rotation.week + 1;
  return {
    ...rotation,
    week: nextWeek,
    serviceRotationIndex:
      nextWeek === 1 ? rotation.serviceRotationIndex + 1 : rotation.serviceRotationIndex,
    strategyBlogWeek: nextWeek % 2 === 1 ? !rotation.strategyBlogWeek : rotation.strategyBlogWeek,
    lastAdvancedAt: new Date().toISOString().slice(0, 10),
  };
}

/** Advance service/authority rotation counters after a full daily run. */
export function advanceRotationDaily(rotation: RotationState): RotationState {
  return {
    ...rotation,
    serviceRotationIndex: rotation.serviceRotationIndex + 1,
    authorityRotationIndex: (rotation.authorityRotationIndex ?? 0) + 1,
    lastAdvancedAt: new Date().toISOString().slice(0, 10),
  };
}

/** @deprecated Use advanceRotationDaily — daily now runs all categories each run. */
export function advanceRotationCategory(rotation: RotationState): RotationState {
  return advanceRotationDaily(rotation);
}

export function touchPage(pages: PageRecord[], url: string): PageRecord[] {
  const today = new Date().toISOString().slice(0, 10);
  return pages.map((p) =>
    p.url === url ? { ...p, lastUpdated: today, implementationStatus: p.implementationStatus ?? 'live' } : p
  );
}
