import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkTitleLayerRules, checkDuplicateTitles } from './qa-checks.js';
import type { PageRecord } from './types.js';

test('national title must not contain city', () => {
  const issues = checkTitleLayerRules({
    url: '/services/led-walls',
    layer: 'national',
    title: 'LED Walls Phoenix',
    bodyHtml: '<a href="/contact">Contact</a>',
  });
  assert.equal(issues.length, 1);
  assert.equal(issues[0].rule, 'national-no-city-title');
});

test('geo title must contain city', () => {
  const issues = checkTitleLayerRules({
    url: '/phoenix-av-production',
    layer: 'geo',
    title: 'AV Production',
    bodyHtml: '<a href="/contact">Contact</a>',
  });
  assert.equal(issues.length, 1);
  assert.equal(issues[0].rule, 'geo-requires-city-title');
});

test('geo title with city passes', () => {
  const issues = checkTitleLayerRules({
    url: '/phoenix-av-production',
    layer: 'geo',
    title: 'Phoenix AV Production',
    bodyHtml: '<a href="/contact">Contact</a>',
  });
  assert.equal(issues.length, 0);
});

test('duplicate titles detected', () => {
  const pages: PageRecord[] = [
    { url: '/a', layer: 'national', type: 'service', title: 'Same Title', track: 'A', tier: 'monthly', phase: 1 },
    { url: '/b', layer: 'national', type: 'service', title: 'Same Title', track: 'A', tier: 'monthly', phase: 1 },
  ];
  const issues = checkDuplicateTitles(pages);
  assert.equal(issues.length, 1);
});
