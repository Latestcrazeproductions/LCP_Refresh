import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildEventTypeSitemapPages,
  indexableEventTypeSlugs,
  isCmsJunkEventSlug,
} from './sitemap-event-types.ts';

const DEFAULTS = [
  { id: 'corporate-keynotes', title: 'Corporate Keynotes' },
  { id: 'product-launches', title: 'Product Launches' },
  { id: 'galas-awards', title: 'Galas & Awards' },
  { id: 'conferences', title: 'Conferences' },
  { id: 'brand-activations', title: 'Brand Activations' },
];

describe('isCmsJunkEventSlug', () => {
  it('drops CMS timestamp slugs and keeps canonical ids', () => {
    assert.equal(isCmsJunkEventSlug('event-type-1773372334847'), true);
    assert.equal(isCmsJunkEventSlug('event-type-'), true);
    assert.equal(isCmsJunkEventSlug('corporate-keynotes'), false);
    assert.equal(isCmsJunkEventSlug('brand-activations'), false);
  });
});

describe('buildEventTypeSitemapPages', () => {
  it('restores missing canonical slugs and drops event-type-* junk', () => {
    const pages = buildEventTypeSitemapPages(DEFAULTS, [
      { id: 'conferences', title: 'Conferences' },
      { id: 'event-type-1773372334847', title: 'CMS leftover' },
      { id: 'product-launches', title: 'Product Launches' },
      { id: 'galas-awards', title: 'Galas & Awards' },
    ]);
    const paths = pages.map((page) => page.path);
    assert.deepEqual(paths, [
      '/events/corporate-keynotes',
      '/events/product-launches',
      '/events/galas-awards',
      '/events/conferences',
      '/events/brand-activations',
    ]);
    assert.equal(
      paths.some((path) => path.includes('event-type-')),
      false
    );
  });

  it('keeps extra non-junk CMS slugs after the defaults', () => {
    const pages = buildEventTypeSitemapPages(DEFAULTS, [
      { id: 'conferences', title: 'Conferences' },
      { id: 'custom-summits', title: 'Custom Summits' },
    ]);
    assert.equal(pages.at(-1)?.path, '/events/custom-summits');
    assert.equal(pages.find((page) => page.path === '/events/corporate-keynotes')?.title, 'Corporate Keynotes');
  });
});

describe('indexableEventTypeSlugs', () => {
  it('unions defaults with CMS ids without dropping junk (live URL still exists)', () => {
    assert.deepEqual(
      indexableEventTypeSlugs(
        ['corporate-keynotes', 'brand-activations'],
        ['conferences', 'event-type-1773372334847']
      ),
      ['corporate-keynotes', 'brand-activations', 'conferences', 'event-type-1773372334847']
    );
  });
});
