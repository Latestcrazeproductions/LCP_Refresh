import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsToolPageBuild, resourceMarkdownWordCount } from './tool-pages.js';

test('resource checklist meets minimum word count after expansion', () => {
  assert.ok(resourceMarkdownWordCount() >= 400);
});

test('needsToolPageBuild is false when live checklist is substantive', () => {
  const pages = [
    {
      url: '/resources/event-production-checklist',
      implementationStatus: 'live' as const,
    },
  ];
  assert.equal(needsToolPageBuild(pages), false);
});

test('needsToolPageBuild is true when live but file missing', () => {
  assert.equal(
    needsToolPageBuild(
      [{ url: '/resources/missing-tool', implementationStatus: 'live' }],
      '/resources/missing-tool'
    ),
    true
  );
});
