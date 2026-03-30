/**
 * Permanent (301) redirects for old site URLs that still appear in Google.
 *
 * Populate from Google Search Console:
 * - Indexing → Pages → open "Not found (404)" or "Soft 404" and note the paths.
 * - Or: Settings → crawl stats / export, or third-party crawl of your domain.
 *
 * Rules:
 * - `source` and `destination` are pathnames on this site (leading `/`, no domain),
 *   unless you need an absolute URL for `destination` (rare).
 * - Use `permanent: true` so Google transfers ranking signals to the new URL.
 * - After deploy, in GSC use URL inspection → "Request indexing" for important targets.
 *
 * Next.js redirect patterns: https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
 *
 * Examples (delete or replace with your real legacy paths):
 *   { source: '/contact-us', destination: '/contact', permanent: true },
 *   { source: '/services/:slug', destination: '/services/:slug', permanent: true },
 */
export const legacyRedirects: Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> = [];
