import type { PageRecord, QaIssue, QaReport } from './types.js';

const CITY_PATTERN =
  /\b(phoenix|scottsdale|tempe|chandler|dallas|denver|austin|seattle|atlanta|chicago|las vegas|san diego|nashville)\b/i;

const CTA_PATTERNS = [
  /href=["']\/contact["']/i,
  /tel:/i,
  /get a quote/i,
  /request a consultation/i,
  /contact us/i,
];

export interface PageContentCheck {
  url: string;
  layer: 'national' | 'geo';
  title: string;
  bodyHtml: string;
  h1?: string;
}

export function checkTitleLayerRules(page: PageContentCheck): QaIssue[] {
  const issues: QaIssue[] = [];
  const title = page.title ?? '';
  const hasCity = CITY_PATTERN.test(title);

  if (page.layer === 'national' && hasCity) {
    issues.push({
      rule: 'national-no-city-title',
      message: `National page ${page.url} title contains city name: "${title}"`,
      severity: 'error',
    });
  }

  if (page.layer === 'geo' && !hasCity) {
    issues.push({
      rule: 'geo-requires-city-title',
      message: `Geo page ${page.url} title missing city: "${title}"`,
      severity: 'error',
    });
  }

  return issues;
}

export function checkDuplicateTitles(pages: PageRecord[]): QaIssue[] {
  const issues: QaIssue[] = [];
  const seen = new Map<string, string>();
  for (const p of pages) {
    const t = (p.title ?? '').trim().toLowerCase();
    if (!t) continue;
    if (seen.has(t)) {
      issues.push({
        rule: 'duplicate-title',
        message: `Duplicate title "${p.title}" on ${p.url} and ${seen.get(t)}`,
        severity: 'error',
      });
    } else {
      seen.set(t, p.url);
    }
  }
  return issues;
}

export function checkCtaPresent(html: string, url: string): QaIssue[] {
  const ok = CTA_PATTERNS.some((re) => re.test(html));
  if (!ok) {
    return [
      {
        rule: 'primary-cta',
        message: `Missing primary CTA on ${url}`,
        severity: 'error',
      },
    ];
  }
  return [];
}

export function checkMinWordCount(text: string, min: number, url: string, label: string): QaIssue[] {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < min) {
    return [
      {
        rule: 'min-word-count',
        message: `${label} on ${url} has ${words} words (min ${min})`,
        severity: 'error',
      },
    ];
  }
  return [];
}

export function runQaChecks(input: {
  pages: PageRecord[];
  pageContents?: PageContentCheck[];
}): QaReport {
  const issues: QaIssue[] = [...checkDuplicateTitles(input.pages)];

  for (const pc of input.pageContents ?? []) {
    issues.push(...checkTitleLayerRules(pc));
    issues.push(...checkCtaPresent(pc.bodyHtml, pc.url));
  }

  return {
    passed: !issues.some((i) => i.severity === 'error'),
    issues,
  };
}
