# Phase 0 — Pre-implementation checklist

Complete before enabling **live** Cursor cloud agent runs (Sprint 2). Sprint 1 engineering can proceed in parallel.

**Testing:** See [IMPLEMENTATION_TESTING.md](./IMPLEMENTATION_TESTING.md) for commands and acceptance checks.

| # | Gate | Owner | Status | Done when |
|---|------|-------|--------|-----------|
| 0.1 | Leadership go-ahead on phased rollout | Jason / leadership | ☐ | Written approval |
| 0.2 | Funnel targets in `content-registry/metrics.json` | Leadership + marketing | ☐ | `targets` fields filled (remove `_pendingLeadership` notes) |
| 0.3 | GSC property verified | Engineering | ☑ | `latestcrazeproductions.com` URL-prefix property verified — see `content-registry/gsc-property.json`; `npm run verify:gsc` |
| 0.4 | Keyword Planner seed → `keywordTAM.json` | Marketing | ☐ | Head terms committed |
| 0.5 | Pilot city list (10 cities) | Product + leadership | ☐ | Cities in `content-registry/sites.json` |
| 0.6 | Case study assets | Marketing | ☐ | Night of Hope + Heard Museum (or equiv.) photos/copy approved |
| 0.7 | Program docs on `main` | Engineering | ☑ | Matrix, orchestrator, workflows, and program docs committed |
| 0.8 | `CURSOR_API_KEY` in GitHub Actions | Engineering | ☐ | Team service account secret configured **and** Cursor GitHub integration connected to `LCP_Refresh` (see below) |
| 0.9 | Cursor spend limit set | Engineering | ☐ | Dashboard limit configured |
| 0.10 | Initial competitor scan | Marketing | ☐ | `content-registry/competitor-scan.json` has ≥5 priority keywords |

### Cursor GitHub integration (gate 0.8)

Cloud agents clone your repo through Cursor's GitHub App — not through GitHub Actions. A valid `CURSOR_API_KEY` alone is **not enough**.

1. [cursor.com/dashboard](https://cursor.com/dashboard) → **Integrations** → **GitHub** → Connect
2. Install the Cursor app on **Latestcrazeproductions** and grant **LCP_Refresh**
3. Create `CURSOR_API_KEY` under the **same Cursor team** → add to GitHub **Development** environment secrets
4. Verify locally or in CI:

```bash
CURSOR_API_KEY=lin_api_... npm run verify:cursor-github
```

Expected: `OK: Latestcrazeproductions/LCP_Refresh is connected for cloud agents.`

If branch errors mention `Failed to verify existence of branch` for `main` or `development`, fix the integration above — both branches exist on GitHub.

**Sign-off**

| Role | Name | Date |
|------|------|------|
| Leadership | | |
| Marketing | | |
| Engineering | | |
