import { test } from 'node:test';
import assert from 'node:assert/strict';
import { upsertPagesByUrl } from './registry.js';
import type { PageRecord } from './types.js';

const base: PageRecord[] = [
  {
    url: '/work/heard-museum-gala',
    layer: 'national',
    type: 'case_study',
    keyword: '',
    title: '',
    track: 'B',
    tier: 'monthly',
    phase: 1,
    lastUpdated: '2026-06-01',
    implementationStatus: 'planned',
  },
  {
    url: '/blog/led-wall-sizing-for-events',
    layer: 'national',
    type: 'blog',
    track: 'A',
    tier: 'monthly',
    phase: 1,
    implementationStatus: 'live',
  },
];

test('upsert updates existing url in place without shifting neighbors', () => {
  const next = upsertPagesByUrl(base, [
    {
      url: '/work/heard-museum-gala',
      title: 'Heard Museum Gala — Premium Event Production',
      keyword: 'museum gala production',
      lastUpdated: '2026-08-20',
    },
  ]);
  assert.equal(next.length, 2);
  assert.equal(next[0]?.url, '/work/heard-museum-gala');
  assert.equal(next[0]?.title, 'Heard Museum Gala — Premium Event Production');
  assert.equal(next[1]?.url, '/blog/led-wall-sizing-for-events');
});

test('upsert appends a new url at the end', () => {
  const next = upsertPagesByUrl(base, [
    {
      url: '/blog/keynote-stage-lighting-for-planners',
      title: 'Keynote Stage Lighting',
      type: 'blog',
      track: 'A',
      lastUpdated: '2026-08-20',
    },
  ]);
  assert.equal(next.length, 3);
  assert.equal(next[2]?.url, '/blog/keynote-stage-lighting-for-planners');
  assert.equal(next[2]?.title, 'Keynote Stage Lighting');
});

test('upsert can apply multiple updates including mix of edit + append', () => {
  const next = upsertPagesByUrl(base, [
    { url: '/work/heard-museum-gala', title: 'Updated' },
    { url: '/blog/new-post', title: 'New Post', type: 'blog' },
  ]);
  assert.equal(next.length, 3);
  assert.equal(next[0]?.title, 'Updated');
  assert.equal(next[2]?.url, '/blog/new-post');
});
