import fs from 'node:fs';
import path from 'node:path';
import type { RegistryPaths } from './registry.js';

export const GSC_SNAPSHOT_DIR = 'gsc-snapshot';
export const REQUIRED_GSC_FILES = ['queries.csv', 'pages.csv'] as const;

export type GscSnapshotStatus = 'present' | 'pending_export' | 'missing';

export interface GscSnapshotFile {
  name: string;
  present: boolean;
  rowCount: number | null;
}

export interface GscSnapshot {
  period: string | null;
  dir: string;
  relativeDir: string;
  status: GscSnapshotStatus;
  files: Record<(typeof REQUIRED_GSC_FILES)[number], GscSnapshotFile>;
  note: string | null;
}

const PERIOD_RE = /^\d{4}-\d{2}$/;

export function lastCompleteMonth(now = new Date()): string {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const last =
    month === 0 ? new Date(Date.UTC(year - 1, 11, 1)) : new Date(Date.UTC(year, month - 1, 1));
  return `${last.getUTCFullYear()}-${String(last.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function gscSnapshotRoot(paths: RegistryPaths): string {
  return path.join(paths.root, GSC_SNAPSHOT_DIR);
}

function listPeriodDirs(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && PERIOD_RE.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function findFileCaseInsensitive(dir: string, wanted: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const lower = wanted.toLowerCase();
  const match = fs.readdirSync(dir).find((name) => name.toLowerCase() === lower);
  return match ? path.join(dir, match) : null;
}

export function countCsvDataRows(filePath: string): number {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) return 0;
  return lines.length - 1;
}

function emptyFiles(): GscSnapshot['files'] {
  return {
    'queries.csv': { name: 'queries.csv', present: false, rowCount: null },
    'pages.csv': { name: 'pages.csv', present: false, rowCount: null },
  };
}

export function loadGscSnapshot(paths: RegistryPaths, period?: string): GscSnapshot {
  const root = gscSnapshotRoot(paths);
  const periods = listPeriodDirs(root);
  const chosen = period ?? periods.at(-1) ?? lastCompleteMonth();
  const dir = path.join(root, chosen);
  const relativeDir = path.posix.join('content-registry', GSC_SNAPSHOT_DIR, chosen);
  const files = emptyFiles();

  if (fs.existsSync(dir)) {
    for (const name of REQUIRED_GSC_FILES) {
      const found = findFileCaseInsensitive(dir, name);
      files[name] = {
        name,
        present: Boolean(found),
        rowCount: found ? countCsvDataRows(found) : null,
      };
    }
  }

  let note: string | null = null;
  const statusPath = findFileCaseInsensitive(dir, 'STATUS.json');
  if (statusPath) {
    try {
      const statusJson = JSON.parse(fs.readFileSync(statusPath, 'utf8')) as { note?: string };
      note = typeof statusJson.note === 'string' ? statusJson.note : null;
    } catch {
      note = 'STATUS.json present but not valid JSON';
    }
  }

  const bothPresent = REQUIRED_GSC_FILES.every((name) => files[name].present);
  let status: GscSnapshotStatus;
  if (!fs.existsSync(dir)) {
    status = 'missing';
  } else if (bothPresent) {
    status = 'present';
  } else {
    status = 'pending_export';
  }

  return {
    period: PERIOD_RE.test(chosen) ? chosen : null,
    dir,
    relativeDir,
    status,
    files,
    note,
  };
}

export function formatGscSnapshotMarkdown(snapshot: GscSnapshot): string {
  const queries = snapshot.files['queries.csv'];
  const pages = snapshot.files['pages.csv'];
  const note = snapshot.note ? `_${snapshot.note}_` : '_No STATUS.json note._';

  return `## GSC snapshot

Status: **${snapshot.status}** (${snapshot.relativeDir})

| File | Present | Data rows |
|------|---------|-----------|
| queries.csv | ${queries.present ? 'yes' : 'no'} | ${queries.rowCount ?? '—'} |
| pages.csv | ${pages.present ? 'yes' : 'no'} | ${pages.rowCount ?? '—'} |

${note}
`;
}
