import type { PageRecord, QaIssue } from './types.js';
import { checkCtaPresent } from './qa-checks.js';

export interface CtaAuditRow {
  url: string;
  primaryCta: string;
  pass: boolean;
}

export function runCtaAudit(
  pages: PageRecord[],
  pageHtmlByUrl: Record<string, string>
): { rows: CtaAuditRow[]; issues: QaIssue[] } {
  const live = pages.filter((p) => p.implementationStatus === 'live');
  const rows: CtaAuditRow[] = [];
  const issues: QaIssue[] = [];

  for (const p of live) {
    const html = pageHtmlByUrl[p.url] ?? '';
    const ctaIssues = checkCtaPresent(html, p.url);
    const pass = ctaIssues.length === 0;
    rows.push({
      url: p.url,
      primaryCta: pass ? '/contact (detected)' : 'MISSING',
      pass,
    });
    issues.push(...ctaIssues);
  }

  return { rows, issues };
}

export function formatCtaAuditMarkdown(rows: CtaAuditRow[]): string {
  const table = rows
    .map((r) => `| ${r.url} | ${r.primaryCta} | ${r.pass ? 'pass' : 'FAIL'} |`)
    .join('\n');
  return `## CTA Audit

| URL | Primary CTA | Result |
|-----|-------------|--------|
${table}
`;
}
