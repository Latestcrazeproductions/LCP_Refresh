import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRegistryPaths } from './registry.js';
import {
  countCsvDataRows,
  formatGscSnapshotMarkdown,
  lastCompleteMonth,
  loadGscSnapshot,
} from './gsc-snapshot.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function makeRegistry(): { paths: ReturnType<typeof getRegistryPaths>; tmp: string } {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gsc-snapshot-'));
  const registry = path.join(tmp, 'content-registry');
  fs.mkdirSync(registry);
  return { paths: getRegistryPaths(tmp), tmp };
}

test('lastCompleteMonth is the UTC month before the given date', () => {
  assert.equal(lastCompleteMonth(new Date('2026-09-16T19:00:00.000Z')), '2026-08');
  assert.equal(lastCompleteMonth(new Date('2026-01-02T00:00:00.000Z')), '2025-12');
});

test('missing snapshot directory is status missing', () => {
  const { paths, tmp } = makeRegistry();
  const snapshot = loadGscSnapshot(paths, '2026-08');
  assert.equal(snapshot.status, 'missing');
  assert.equal(snapshot.files['queries.csv'].present, false);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('period folder without CSVs is pending_export', () => {
  const { paths, tmp } = makeRegistry();
  const dir = path.join(paths.root, 'gsc-snapshot', '2026-08');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'STATUS.json'),
    JSON.stringify({ status: 'pending_export', note: 'waiting on Steve export' })
  );
  const snapshot = loadGscSnapshot(paths);
  assert.equal(snapshot.period, '2026-08');
  assert.equal(snapshot.status, 'pending_export');
  assert.equal(snapshot.note, 'waiting on Steve export');
  assert.match(formatGscSnapshotMarkdown(snapshot), /pending_export/);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('queries.csv + pages.csv mark the snapshot present and count data rows', () => {
  const { paths, tmp } = makeRegistry();
  const dir = path.join(paths.root, 'gsc-snapshot', '2026-08');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'Queries.csv'),
    '\uFEFFTop queries,Clicks,Impressions,CTR,Position\nevent production phoenix,2,40,5%,8.1\n\n'
  );
  fs.writeFileSync(
    path.join(dir, 'pages.csv'),
    'Top pages,Clicks,Impressions,CTR,Position\nhttps://latestcrazeproductions.com/,4,90,4.44%,6.2\n'
  );
  const snapshot = loadGscSnapshot(paths, '2026-08');
  assert.equal(snapshot.status, 'present');
  assert.equal(snapshot.files['queries.csv'].rowCount, 1);
  assert.equal(snapshot.files['pages.csv'].rowCount, 1);
  assert.equal(countCsvDataRows(path.join(dir, 'Queries.csv')), 1);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('committed 2026-08 snapshot is pending_export with no invented CSVs', () => {
  const snapshot = loadGscSnapshot(getRegistryPaths(repoRoot), '2026-08');
  assert.equal(snapshot.status, 'pending_export');
  assert.equal(snapshot.files['queries.csv'].present, false);
  assert.equal(snapshot.files['pages.csv'].present, false);
  assert.equal(snapshot.files['queries.csv'].rowCount, null);
});
