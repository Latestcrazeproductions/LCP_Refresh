# LCP Inbound Demand Engine — Build Plan

**Status:** Active execution guide  
**Last updated:** June 2026

**Execution tracker:** Linear project **LCP Inbound Demand Engine** (team: `LCP-calendar-look-ahead`)  
**Sync:** `npm run sync:linear` — updates issues + mirrors all `docs/*.md` into Linear documents (CI runs on push to `development`)  
**Structure source:** `scripts/linear-build-plan.json`  
**Cursor build queue (local):** `npm run beads:draft` → `npm run beads:import` — agent-native tasks from the build plan; stealth `.beads/`; **retire at P4 exit**

**Related:** [Technical Overview](./TECHNICAL_OVERVIEW.md) · [Agent SEO Automation](./AGENT_SEO_AUTOMATION.md) · [Product Implementation Plan](./PRODUCT_IMPLEMENTATION_PLAN.md) · [Phase 0 Checklist](./PHASE_0_CHECKLIST.md)

---

## Current state

| Layer | Status |
|-------|--------|
| Next.js site (~29 routes), CMS, geo page | **Live** |
| SEO matrix (`scripts/generate-seo-page-matrix.mjs`) | **Live** |
| `content-registry/`, orchestrator, agents, cron | **Built in repo — enable after Phase 0 gates** |

---

## Locked decisions

| Decision | Choice |
|----------|--------|
| Runtime | Cursor **cloud** SDK (`cloud: { repos, autoCreatePr: true }`, `composer-2.5`) |
| Publish gate | **PR-only** — human merge → Vercel |
| Agents | **7 roles**: Research, Planner, National, Geo, ServiceRefresh, Authority, QA |
| Intelligence v1 | GSC, Keyword Planner, Trends, Bing WMT, matrix, sales intel, competitor scan — **no Semrush** |
| Content mix | 55% service / 15% capture / 15% strategy / 15% authority |
| Keyword layers | National: no city in title. Geo: city required. |
| Task cap | Max **5 tasks per run** |
| Agent scope | `src/app/**`, `src/content/`, `content-library/`, `content-registry/` only |

---

## Phase 0 — Gates (before Sprint 1)

See [PHASE_0_CHECKLIST.md](./PHASE_0_CHECKLIST.md). Leadership must complete gates; engineering can run Sprint 1 in parallel except where noted.

**Exit:** Checklist complete → enable live agent workflows (Sprint 2+).

---

## Sprint 1 — Foundation (2 weeks, no agents)

**Goal:** Registry, library, routes, orchestrator dry-run, QA. Zero Cursor API spend.

| # | Deliverable | Verify |
|---|-------------|--------|
| 1.1 | `npm run generate:seo-matrix` | Regenerates matrix XML |
| 1.2 | `content-registry/` seeded | `pages.jsonl` populated |
| 1.3 | `npm run seed-registry` | Merges matrix + live paths |
| 1.4 | `content-library/` manifests | Topics, case studies, tools |
| 1.5 | `agents/prompts/` + rules | All 7 prompt stubs |
| 1.6 | `scripts/seo-orchestrator` | `registry`, `scheduler`, `qa-checks` |
| 1.7 | `--dry-run` CLI | Prints Task[] JSON |
| 1.8 | `/blog`, `/work`, `/resources` routes | Render + sitemap |
| 1.9 | `seo-weekly-dry-run.yml` | workflow_dispatch green |

```bash
cd scripts/seo-orchestrator && npm ci
npm run seo:run -- --cadence weekly --dry-run
```

---

## Sprint 2 — First cloud agent PR (2 weeks)

**Prerequisite:** `CURSOR_API_KEY` in GitHub Actions secrets.

| # | Deliverable |
|---|-------------|
| 2.1 | `dispatch.ts` with explicit cloud config |
| 2.2 | `ServiceRefreshAgent` prompt complete |
| 2.3 | First agent PR (FAQ + date on one service page) |
| 2.4 | `seo-daily.yml` live (`--max-tasks 1`, 1 category/weekday) |

**Cost controls:** `composer-2.5`, max 5 tasks/run, phase builds manual only, Cursor spend limit set.

---

## Sprint 3 — Full cadence (3 weeks)

| # | Deliverable |
|---|-------------|
| 3.1 | ResearchAgent + intelligence inputs |
| 3.2–3.4 | National, Geo, Authority agents |
| 3.5 | QAAgent LLM pass |
| 3.6 | PlannerAgent (research priorities, mix, phase gates) |
| 3.7 | `demand-math.ts` monthly gap report |
| 3.8 | `conversion.cta_audit` |
| 3.9 | Rotation advancement |
| 3.10 | `seo-monthly.yml` + `seo-quarterly.yml` |

---

## Sprint 4 — Phase build + operate (2 weeks)

| # | Deliverable |
|---|-------------|
| 4.1 | `seo-phase-build.yml` |
| 4.2 | Phase 1 national content (manual trigger) |
| 4.3 | Phase 2 ten-city pilot |
| 4.4 | Bulk QA on expanded registry |
| 4.5 | [SEO Ops Runbook](./SEO_OPS_RUNBOOK.md) |
| 4.6 | PR template (`.github/pull_request_template/seo-agent.md`) |

### Phase exit gates

| Phase | Exit |
|-------|------|
| 1 | Nationwide hub live; ≥15 new URLs; ≥1 agent PR; GSC impressions > 0 |
| 2 | 10 pilot cities ≥30 days; no cannibalization flags |
| 3 | 100 cities or leadership cap; 50+ GSC queries with impressions |
| 4 | Cron-only operate; leads trending toward targets |

---

## Measurement (no Semrush)

1. **Coverage** — registry + GSC index  
2. **Visibility** — GSC impressions, queries, positions 8–30  
3. **Traffic** — GA4 organic sessions  
4. **Leads** — forms, quote requests  
5. **Sales** — CRM opportunities, pipeline  

Monthly: commit GSC CSV → `content-registry/gsc-snapshot/`; update `metrics.json` actuals.

---

## Steady-state rhythm

| Cadence | Automation | Human |
|---------|------------|-------|
| **Daily Mon–Fri 9am PT** | **One task per category** (capture, service, strategy, authority, geo) — up to 5 agent PRs | Review PRs 30–60 min each |
| Monthly 1st | ResearchAgent → Track B | Update metrics actuals |
| Quarterly | Deep refresh, tools, competitor audit | Pruning decisions |
| Phase build | Manual only | Extended review |

---

## Beads (Cursor build queue — temporary)

**Purpose:** Keep Cursor agents on track while **building** the demand engine. Not used for steady-state SEO ops (those use `content-registry/` + orchestrator + Linear).

| Layer | Role |
|-------|------|
| **Linear** | Program status, owners, milestones (human truth) |
| **Docs** | Architecture reference — link, don’t paste into beads |
| **Beads** | Agent-native session queue (local, stealth) |

**Scope:** `phase-0` (engineering only) + `sprint-1`–`sprint-4`. Excludes `steady-state`, `phase-exits`, and non-engineering Phase 0 gates.

**Workflow:**

```bash
npm run beads:draft              # preview open engineering tasks
npm run beads:draft:write        # write scripts/beads-build-queue.json (reviewable)
npm run beads:import             # import open todos into local .beads/
bd ready                         # pick unblocked work
# … implement …
bd close <id>                    # same session you update Linear
```

**Drift rule:** When a bead closes, update the matching Linear issue (look for `lcp-build-plan:<epic>/<key>` in the bead’s external ref).

**Retire at P4 exit:** Stop importing; close remaining build beads; remove `.cursor/rules/beads.mdc` (or disable); optional `rm -rf .beads`. Steady-state uses registry + cron only.

Agent-native overrides per deliverable: `scripts/beads-build-overrides.json`.  
**How-to:** [BEADS_HOWTO.md](./BEADS_HOWTO.md)

---

## Commands reference

```bash
# Regenerate SEO matrix
npm run generate:seo-matrix

# Seed content registry from matrix
npm run seed-registry

# Orchestrator dry-run
cd scripts/seo-orchestrator && npm run seo:run -- --cadence weekly --dry-run

# Live run (requires CURSOR_API_KEY)
cd scripts/seo-orchestrator && npm run seo:run -- --cadence weekly --max-tasks 2

# Beads build queue (local Cursor sessions)
npm run beads:draft
npm run beads:import
bd ready
```
