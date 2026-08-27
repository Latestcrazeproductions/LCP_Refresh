# SEO Automation Ops Runbook

Operations guide for the LCP inbound demand engine. See [BUILD_PLAN.md](./BUILD_PLAN.md).

## Review and publish

Two gates. Agent PRs are drafts. Production is a separate publish.

| Gate | Branch | URL |
|------|--------|-----|
| **1 — Staging** | Merge PRs into `development` | [development preview](https://lcprefresh-git-development-latestcrazeproductions-projects.vercel.app) |
| **2 — Production** | Fast-forward `main` to `development` | [latestcrazeproductions.com](https://latestcrazeproductions.com) |

Do not open agent PRs against `main`. Do not auto-merge to `main`.

### Weekday cadence (Pacific)

| When | What |
|------|------|
| ~9:00am | SEO Daily opens up to 5 PRs into `development` |
| ~10:00–11:00am | Agents finish; wait for the Daily **job** to complete before merging |
| **12:00pm (30–45 min)** | Review, merge, publish |

### Gate 1 — merge to staging

1. Wait until **Actions → SEO Daily** has finished (persist step included).
2. For each new PR into `development`: skim files (no pricing, no unapproved client names, no internal labels like “Demand capture” on the page). Use the [human review checklist](./AGENT_SEO_AUTOMATION.md#human-review-checklist-pr-template).
3. Open the **content path** on the PR preview, not `/`. Vercel’s Visit button always opens the homepage — append `/blog/{slug}`, `/work/{slug}`, or `/services/{slug}`.
4. Merge into `development`.
5. Spot-check the **batch** on the [development preview](https://lcprefresh-git-development-latestcrazeproductions-projects.vercel.app) (same paths). Overlapping agent work shows up here.

If Preview shows a Vercel login wall, see [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md#preview--development-branch-urls-deployment-protection).

### Gate 2 — publish to production

When staging looks right, same day:

1. GitHub → **Actions → Publish to production → Run workflow**.
2. Type `publish` in the confirm field.
3. The job fast-forwards `main` to `development` only if `main` has no unique commits. It writes the commit range to the Actions summary and comments on the live commit.
4. Confirm the same paths on [latestcrazeproductions.com](https://latestcrazeproductions.com).

Skip publish if staging is wrong; leave it on `development` and fix the next day.

Optional: **Settings → Environments → Production → Required reviewers** so Run workflow waits for an approval.

Engineering `feature/*` PRs still target `development` and ship in the next noon publish after review.

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

## Monthly topic queue replenishment

On the **1st of each month**, `seo-monthly.yml` dispatches `research.topic_queue_replenish` first. ResearchAgent tops up:

| Queue | File | Target queued |
|-------|------|----------------|
| National capture (Track A) | `content-library/topics/national-blog-topics.json` | **45** (~2/day × 22 weekdays) |
| Strategy (Track B) | `content-library/topics/strategy-blog-topics.json` | **22** (~1/day × 22 weekdays) |

Adjust targets in `content-registry/config.json` → `topicQueues`. Human review the research PR before the daily runs drain the new topics.

## Monthly intelligence update (no Semrush)

1. Export GSC queries + pages CSV → `content-registry/gsc-snapshot/YYYY-MM/`
2. Update `content-registry/competitor-scan.json` for priority keywords
3. Update `content-registry/metrics.json` actuals from GA4 + CRM
4. Commit before monthly workflow runs (1st of month)

## Review agent PRs

Use checklist in [AGENT_SEO_AUTOMATION.md § Human review](./AGENT_SEO_AUTOMATION.md#human-review-checklist-pr-template).

### Preview the page (not just the homepage)

1. Open the Vercel **Preview** deployment for the PR (or the `development` branch deploy).
2. If you see a **Vercel Login** wall, turn off Preview **Deployment Protection** — see [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md#preview--development-branch-urls-deployment-protection).
3. Append the content path to the preview host (Vercel’s button only opens `/`):

```text
https://lcprefresh-git-development-latestcrazeproductions-projects.vercel.app/blog/{slug}
https://lcprefresh-git-development-latestcrazeproductions-projects.vercel.app/work/{slug}
```

4. Merge PR → `development`, spot-check staging, then publish with **Actions → Publish to production** ([Review and publish](#review-and-publish)).

### Why `pages.jsonl` merge conflicts happen

Daily cadence can open ~5 PRs that all touch `content-registry/pages.jsonl`. Agents must use:

```bash
npm run registry:upsert -- --url="/blog/slug" --title="Title" --type=blog --track=A
```

That updates a record **by URL** instead of rewriting the file tail. Still rebase onto `development` before merge when several PRs are open.

## Cost controls

- Default daily workflow uses `--max-tasks 5` (one task per content category)
- Phase builds: manual trigger only; max 10 sites per PR for geo
- Use `--dry-run` locally before changing scheduler logic

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `CURSOR_API_KEY not set` | Complete [Phase 0 checklist](./PHASE_0_CHECKLIST.md) gate 0.8 |
| Agent PR missing registry diff | Re-run with prompt reminder; verify agent scope |
| QA fails national/geo title | Check `qa-checks.ts` rules vs page metadata |
| Geo tasks not scheduling | Confirm nationwide hub is `live` in pages.jsonl and `allowNewGeoSites: true` |
| Preview URL = Vercel Login | Disable Preview Deployment Protection ([DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md#preview--development-branch-urls-deployment-protection)) |
| Preview only shows homepage | Append `/blog/{slug}` (or `/work`, `/services`) — Visit link is always `/` |
| Publish to production refuses | `main` has commits not on `development` — do not force-push; reconcile branches first |
