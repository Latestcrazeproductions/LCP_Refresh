# SEO Automation Ops Runbook

Operations guide for the LCP inbound demand engine. See [BUILD_PLAN.md](./BUILD_PLAN.md).

## Add a pilot city

1. Add entry to [`content-registry/sites.json`](../content-registry/sites.json)
2. Add site to `geoBatchA` or `geoBatchB` in [`content-registry/rotation.json`](../content-registry/rotation.json)
3. Run `npm run seed-registry` to merge matrix URLs for that market
4. Trigger manual phase build: **Actions → SEO Phase Build → phase 2**

## Re-seed registry from matrix

```bash
npm run generate:seo-matrix
npm run seed-registry
```

Commit updated `content-registry/pages.jsonl`.

## Pause automation

1. Disable scheduled workflows in GitHub Actions (SEO Daily / Monthly / Quarterly)
2. Set `content-registry/config.json` → `"allowNewGeoSites": false` to block geo tasks in scheduler

## Monthly intelligence update (no Semrush)

1. Export GSC queries + pages CSV → `content-registry/gsc-snapshot/YYYY-MM/`
2. Update `content-registry/competitor-scan.json` for priority keywords
3. Update `content-registry/metrics.json` actuals from GA4 + CRM
4. Commit before monthly workflow runs (1st of month)

## Review agent PRs

Use checklist in [AGENT_SEO_AUTOMATION.md § Human review](./AGENT_SEO_AUTOMATION.md#human-review-checklist-pr-template).

## Cost controls

- Default daily workflow uses `--max-tasks 1` (one content category per weekday)
- Phase builds: manual trigger only; max 10 sites per PR for geo
- Use `--dry-run` locally before changing scheduler logic

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `CURSOR_API_KEY not set` | Complete [Phase 0 checklist](./PHASE_0_CHECKLIST.md) gate 0.8 |
| Agent PR missing registry diff | Re-run with prompt reminder; verify agent scope |
| QA fails national/geo title | Check `qa-checks.ts` rules vs page metadata |
| Geo tasks not scheduling | Confirm nationwide hub is `live` in pages.jsonl and `allowNewGeoSites: true` |
