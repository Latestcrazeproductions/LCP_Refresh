interface MetricsFile {
  targets: Record<string, number | null>;
  actuals: Record<string, number | null>;
}

export interface FunnelGapReport {
  generatedAt: string;
  gaps: Array<{ metric: string; target: number | null; actual: number | null; gap: number | null }>;
  summary: string;
}

export function buildFunnelGapReport(metrics: MetricsFile): FunnelGapReport {
  const keys = [
    'monthlyOrganicSessions',
    'monthlyOrganicLeads',
    'monthlyOrganicOpportunities',
    'monthlyOrganicRevenue',
  ] as const;

  const gaps = keys.map((metric) => {
    const target = metrics.targets[metric] ?? null;
    const actual = metrics.actuals[metric] ?? null;
    const gap =
      target != null && actual != null && typeof target === 'number' && typeof actual === 'number'
        ? target - actual
        : null;
    return { metric, target, actual, gap };
  });

  const missing = gaps.filter((g) => g.target == null).length;
  const summary =
    missing > 0
      ? `${missing} target(s) unset — leadership must fill metrics.json targets (Phase 0).`
      : gaps.every((g) => g.gap != null && g.gap <= 0)
        ? 'All tracked metrics at or above target.'
        : 'Gap detected — see metrics below. Consider shifting content mix toward conversion assets if leads lag impressions.';

  return {
    generatedAt: new Date().toISOString(),
    gaps,
    summary,
  };
}

export function formatGapReportMarkdown(report: FunnelGapReport): string {
  const rows = report.gaps
    .map(
      (g) =>
        `| ${g.metric} | ${g.target ?? '—'} | ${g.actual ?? '—'} | ${g.gap ?? '—'} |`
    )
    .join('\n');

  return `## Revenue Model (metrics.monthly_review)

${report.summary}

| Metric | Target | Actual | Gap |
|--------|--------|--------|-----|
${rows}

_Generated ${report.generatedAt}_
`;
}
