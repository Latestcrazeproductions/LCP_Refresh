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
    strategyBlogWeek: nextWeek % 2 === 1 ? !rotation.strategyBlogWeek : rotation.strategyBlogWeek,
    lastAdvancedAt: new Date().toISOString().slice(0, 10),
  };
}

export function touchPage(pages: PageRecord[], url: string): PageRecord[] {
  const today = new Date().toISOString().slice(0, 10);
  return pages.map((p) =>
    p.url === url ? { ...p, lastUpdated: today, implementationStatus: p.implementationStatus ?? 'live' } : p
  );
}
