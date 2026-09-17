import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractFirstMarkdownImage } from './markdown-pages.ts';
import { absolutizeSiteUrl, resolveMarkdownShareImage } from './article-metadata.ts';
import type { MarkdownPage } from './markdown-pages.ts';

test('extractFirstMarkdownImage reads the first figure', () => {
  const found = extractFirstMarkdownImage(
    'Intro\n\n![Gala stage with LED backdrop](/images/marketing/case-studies/heard-museum-gala-stage.jpg)\n\nMore copy'
  );
  assert.deepEqual(found, {
    src: '/images/marketing/case-studies/heard-museum-gala-stage.jpg',
    alt: 'Gala stage with LED backdrop',
  });
});

test('resolveMarkdownShareImage prefers frontmatter then body then fallback', () => {
  const page: MarkdownPage = {
    slug: 'heard-museum-gala',
    title: 'Heard Museum Gala',
    description: 'Museum gala production case study',
    body: '![Stage](/images/marketing/case-studies/heard-museum-gala-stage.jpg)',
  };
  const fromBody = resolveMarkdownShareImage(page);
  assert.equal(fromBody.isItemImage, true);
  assert.equal(fromBody.src, '/images/marketing/case-studies/heard-museum-gala-stage.jpg');

  const fromFrontmatter = resolveMarkdownShareImage({
    ...page,
    image: '/images/custom-og.jpg',
  });
  assert.equal(fromFrontmatter.src, '/images/custom-og.jpg');

  const fallback = resolveMarkdownShareImage({ ...page, body: 'No image here.' });
  assert.equal(fallback.isItemImage, false);
  assert.match(fallback.src, /^https:\/\//);
});

test('absolutizeSiteUrl keeps remote URLs and prefixes site origin', () => {
  const remote = 'https://images.unsplash.com/photo.jpg';
  assert.equal(absolutizeSiteUrl(remote), remote);
  assert.equal(
    absolutizeSiteUrl('/images/marketing/case-studies/heard-museum-gala-stage.jpg'),
    'https://latestcrazeproductions.com/images/marketing/case-studies/heard-museum-gala-stage.jpg'
  );
});
