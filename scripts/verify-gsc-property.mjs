#!/usr/bin/env node
/**
 * Phase 0 gate 0.3 — verify GSC property readiness and registry status.
 *
 * Usage: node scripts/verify-gsc-property.mjs
 *        npm run verify:gsc
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GSC_PATH = path.join(ROOT, 'content-registry/gsc-property.json');
const CONFIG_PATH = path.join(ROOT, 'content-registry/config.json');

const TIMEOUT_MS = 15_000;

function fail(message) {
  console.error(`verify:gsc FAIL — ${message}`);
  process.exit(1);
}

function ok(message) {
  console.log(`verify:gsc OK — ${message}`);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`missing ${path.relative(ROOT, filePath)}`);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    fail(`invalid JSON in ${path.relative(ROOT, filePath)}: ${err.message}`);
  }
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LCP-verify-gsc-property/1.0' },
      redirect: 'follow',
    });
    const text = await res.text();
    return { status: res.status, text, url: res.url };
  } finally {
    clearTimeout(timer);
  }
}

function normalizeDomain(value) {
  return String(value)
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .toLowerCase();
}

const gsc = readJson(GSC_PATH);
const config = readJson(CONFIG_PATH);

if (gsc.status !== 'verified') {
  fail(`content-registry/gsc-property.json status must be "verified" (got "${gsc.status ?? 'unset'}")`);
}

if (!gsc.propertyUrl || !gsc.domain) {
  fail('gsc-property.json must include propertyUrl and domain');
}

if (!gsc.verifiedAt || !gsc.confirmedBy) {
  fail('gsc-property.json must include verifiedAt and confirmedBy (human/engineering sign-off)');
}

const flagship = normalizeDomain(config.flagshipDomain ?? '');
const registryDomain = normalizeDomain(gsc.domain);
if (!flagship || flagship !== registryDomain) {
  fail(
    `domain mismatch: config.json flagshipDomain="${config.flagshipDomain}" vs gsc-property.json domain="${gsc.domain}"`
  );
}

const baseUrl = gsc.propertyUrl.replace(/\/$/, '');
ok(`registry status verified for ${gsc.propertyType} ${gsc.propertyUrl}`);

const home = await fetchText(baseUrl);
if (home.status !== 200) {
  fail(`${baseUrl} returned HTTP ${home.status}`);
}
ok(`production site reachable (${baseUrl})`);

const robots = await fetchText(`${baseUrl}/robots.txt`);
if (robots.status !== 200) {
  fail(`robots.txt returned HTTP ${robots.status}`);
}
if (!/sitemap:\s*https?:\/\//i.test(robots.text)) {
  fail('robots.txt missing Sitemap directive');
}
ok('robots.txt includes sitemap');

const sitemap = await fetchText(`${baseUrl}/sitemap.xml`);
if (sitemap.status !== 200) {
  fail(`sitemap.xml returned HTTP ${sitemap.status}`);
}
if (!sitemap.text.includes('<urlset') || !sitemap.text.includes(registryDomain)) {
  fail('sitemap.xml missing urlset or flagship domain URLs');
}
ok('sitemap.xml valid and includes production URLs');

const token = process.env.GOOGLE_SITE_VERIFICATION?.trim();
if (token) {
  const metaPattern = new RegExp(
    `google-site-verification["']\\s*content=["']${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
    'i'
  );
  if (!metaPattern.test(home.text)) {
    fail('GOOGLE_SITE_VERIFICATION is set locally but meta tag not found on live homepage');
  }
  ok('HTML meta verification tag present on live site');
}

console.log('');
console.log('GSC property gate 0.3 passed.');
console.log(`  Property: ${gsc.propertyUrl}`);
console.log(`  Verified: ${gsc.verifiedAt} by ${gsc.confirmedBy}`);
console.log(`  Dashboard: ${gsc.dashboardUrl ?? 'https://search.google.com/search-console'}`);
