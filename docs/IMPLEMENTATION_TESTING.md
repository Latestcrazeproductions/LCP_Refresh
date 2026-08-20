# Implementation testing guide

Use this checklist after engineering changes or before enabling live Cursor agent workflows.

## Quick commands

```bash
npm run seed-registry          # Refresh pages.jsonl from matrix + live site paths
npm run seo:test               # QA rule unit tests (orchestrator)
npm run seo:dry-run            # Weekly task schedule (no API key)
npm run seo:dry-run:monthly    # Monthly tasks + funnel gap + CTA audit preview
npm run verify:gsc             # Confirm GSC property file (Phase 0.3)
npm run generate:seo-matrix    # Regenerate public/seo-page-matrix.xml
```

Live agent dispatch (requires `CURSOR_API_KEY`):

```bash
cd scripts/seo-orchestrator && npm ci

# Recommended first test — one gallery swap on /services/led-walls, PR targets development
CURSOR_API_KEY=... npm run seo:run -- --cadence weekly --max-tasks 1 --only-type service.gallery_swap

# Or from repo root:
CURSOR_API_KEY=... npm run seo:live -- --only-type service.gallery_swap
```

Cloud agents branch from **`development`** by default (`CURSOR_AGENT_REF`). PRs must target `development`, not `main`.

**GitHub Actions:** use workflow **SEO Agent Test (live)** → `only_type: service.gallery_swap` → Run workflow.

---

## 1. Registry seeding

**Command:** `npm run seed-registry`

**Expect:**

- Console: `Wrote N records (27 live) to content-registry/pages.jsonl` (live count may grow as you add content)
- Live rows include: core pages, `/services/*`, `/events/*`, `/blog/*`, `/work/*`, `/resources/*` from `content-library/`
- Planned rows: matrix `/feeds/*` URLs and Phase 1 hubs (`/nationwide-event-production`, `/markets`)

**Verify:**

```bash
rg '"implementationStatus":"live"' content-registry/pages.jsonl | wc -l
rg '/services/led-walls' content-registry/pages.jsonl
```

---

## 2. Orchestrator unit tests

**Command:** `npm run seo:test`

**Expect:** 4 tests pass (title rules, duplicate detection)

---

## 3. Weekly dry-run

**Command:** `npm run seo:dry-run`

**Expect (week 1, phase 1, geo locked):**

- `taskCount`: 3 (max 5)
- Tasks include: `blog.national.create`, `service.gallery_swap` on `/services/led-walls`, `service.date_touch` on `/nationwide-event-production`
- `[dry-run] No agents dispatched.`
- No `CURSOR_API_KEY` error

**Phase 1 note:** Geo tasks stay national-only until `/nationwide-event-production` is `implementationStatus: live`.

---

## 4. Monthly dry-run

**Command:** `npm run seo:dry-run:monthly`

**Expect:**

- Track B tasks: `conversion.cta_audit`, `metrics.monthly_review`, `authority.case_study`, etc. (capped at 5)
- Markdown **Funnel gap report** (shows pending leadership targets until `metrics.json` filled)
- **CTA audit** table for live pages

---

## 5. Site routes (manual)

Start dev server: `npm run dev`

| URL | Expect |
|-----|--------|
| `/blog` | Index lists `corporate-gala-production-guide` |
| `/blog/corporate-gala-production-guide` | Renders markdown |
| `/work` | Index lists queued case studies when published |
| `/work/[slug]` | Case study renders when markdown exists |
| `/resources/event-production-checklist` | Resource page renders |
| `/sitemap.xml` | Includes blog, work, resources URLs |

---

## 6. GitHub Actions (after Phase 0.8)

| Workflow | Trigger | Expect without API key | Expect with API key |
|----------|---------|------------------------|---------------------|
| `seo-weekly-dry-run.yml` | Manual | Green; prints tasks | N/A |
| `seo-weekly.yml` | Mon 16:00 UTC | Fails at dispatch | Opens PR |
| `seo-monthly.yml` | 1st of month | Fails at dispatch | Opens PR |
| `seo-phase-build.yml` | Manual | Fails at dispatch | Phase build PR |

**Before adding `CURSOR_API_KEY`:** Run dry-run workflow only.

---

## 7. Phase 0 gates still required for production

See [PHASE_0_CHECKLIST.md](./PHASE_0_CHECKLIST.md):

- 0.1 Leadership approval
- 0.2 Funnel targets in `metrics.json`
- 0.8 `CURSOR_API_KEY` in GitHub Actions
- 0.6 Case study asset clearance
- 0.5 Pilot city list

---

## 8. Sprint 2 acceptance (first live agent PR)

### Prerequisites

1. `CURSOR_API_KEY` in GitHub Actions secrets (or exported locally)
2. Cursor spend limit set on the account
3. Orchestrator changes merged to **`development`** on GitHub (cloud agents clone that branch)
4. Leadership aware you are running one test PR (Phase 0.1)

### Run (pick one)

**GitHub (recommended):** Actions → **SEO Agent Test (live)** → `only_type: service.gallery_swap` → Run workflow

**Local:**

```bash
CURSOR_API_KEY=... npm run seo:live -- --only-type service.gallery_swap
```

### Review

1. Agent opens a PR **into `development`** (not `main`)
2. Review diff: gallery image + alt on `/services/led-walls`, `pages.jsonl` updated
3. Check Vercel preview on the PR
4. Merge when quality passes → verify preview deploy

### After first success

- Enable `seo-weekly.yml` cron or run with `--max-tasks 1`
- Mark Linear [LCP-32](https://linear.app/lcp-calendar-look-ahead/issue/LCP-32) done

---

## Related docs

- [PHASE_0_CHECKLIST.md](./PHASE_0_CHECKLIST.md)
- [PRODUCT_IMPLEMENTATION_PLAN.md](./PRODUCT_IMPLEMENTATION_PLAN.md)
- [AGENT_SEO_AUTOMATION.md](./AGENT_SEO_AUTOMATION.md)
- [SEO_OPS_RUNBOOK.md](./SEO_OPS_RUNBOOK.md)
- [BEADS_HOWTO.md](./BEADS_HOWTO.md)
