# Beads how-to (LCP build phase)

Beads (`bd`) is your **local Cursor work queue** while building the demand engine. It is **not** used for steady-state SEO ops (those use Linear + `content-registry/` + cron).

Linear = program status for humans. Beads = agent-ready tasks for your Cursor sessions.

---

## Daily workflow

```bash
# 1. See what you can work on (no blockers)
bd ready

# 2. Claim one issue (marks it in progress)
bd update <id> --claim

# 3. Do the work (or let Cursor do it)

# 4. Close the bead when the deliverable is done
bd close <id> --reason "Short note on what shipped"

# 5. Update Linear to match (same session)
#    Find the issue with marker lcp-build-plan:<epic>/<key>
```

**Drift rule:** Close the bead and update Linear in the **same session**. If you merge a PR but forget Linear, the program tracker lies. If you close Linear but not the bead, `bd ready` lies.

---

## Import build tasks from the plan

Most beads come from the build plan — you usually **import**, not hand-write.

```bash
npm run beads:draft        # preview open engineering tasks
npm run beads:draft:write  # refresh scripts/beads-build-queue.json
npm run beads:import       # create beads in local .beads/ (skips existing)
bd ready
```

Re-run `npm run beads:import` after editing `scripts/linear-build-plan.json`. It will not duplicate issues that already have the same `lcp-build-plan:*` external ref.

---

## Essential commands

| Command | What it does |
|---------|----------------|
| `bd ready` | Shows work with **no blockers** — start here |
| `bd list` | All open issues (including blocked) |
| `bd list --status open` | Open only |
| `bd show <id>` | Full description, acceptance criteria, deps |
| `bd update <id> --claim` | Start working (atomic claim) |
| `bd close <id> --reason "..."` | Mark done |
| `bd blocked` | Why something is stuck |
| `bd prime` | Load workflow context for agents |

Example:

```bash
bd ready
bd update LCP_Refresh-8pg --claim
bd show LCP_Refresh-8pg
bd close LCP_Refresh-8pg --reason "CURSOR_API_KEY added to GitHub Actions"
```

---

## Starting work (manual vs import)

### Imported tasks (usual)

1. `npm run beads:import`
2. `bd ready`
3. `bd update <id> --claim`

These map to `scripts/linear-build-plan.json` (engineering, build sprints only).

### Manual bead (one-off work)

Use when you discover work that is **not** in the build plan — a bug, spike, or refactor found mid-session.

```bash
bd create "Fix dispatch error logging" \
  --type task \
  --acceptance "npm run seo:run -- --cadence weekly --dry-run exits 0" \
  --description "## Objective
Fix X.

## Scope
- scripts/seo-orchestrator/src/dispatch.ts

## Constraints
- PR-only; branch from development"

bd update <new-id> --claim
```

Tip: keep the same sections (Objective, Scope, Constraints, Steps) so Cursor agents get usable context.

---

## When to close a bead

Close when **all** of this is true:

1. **Acceptance criteria met** — run the verify command in the bead (`bd show <id>` → ACCEPTANCE CRITERIA).
2. **Code/docs landed** — PR merged, or change committed if no PR was needed.
3. **Linear updated** — matching issue marked Done (or comment added for partial work).

| Situation | Close bead? |
|-----------|-------------|
| PR merged; deliverable shipped | **Yes** — close + Linear Done |
| Blocked on leadership/marketing | **No** — leave open or defer; not agent work |
| Decided to skip / won't do | **Yes** — close with reason "Won't do: …" + cancel in Linear |
| Partial progress, more sessions needed | **No** — leave open; add notes if needed |
| Duplicate or bad import | **Yes** — close with reason "duplicate" |

**Do not close** just because you stopped for the day. Leave it claimed/open and pick it up next session.

---

## When *not* to use beads

- **Steady-state SEO** (weekly cron, registry rotation) — Linear + orchestrator only
- **Leadership gates** (0.1 approval, pilot city sign-off) — Linear only unless you are doing engineering prep
- **After P4 exit** — retire beads (see BUILD_PLAN.md)

---

## Quick checks

```bash
# What's blocking sprint work?
bd blocked

# Find by plan marker
bd list | grep "0.8"

# Reload agent context
bd prime
```

---

## Retire beads (when build is complete)

At Phase 4 exit / steady-state:

1. Close any remaining open build beads
2. Stop running `npm run beads:import`
3. Remove or disable `.cursor/rules/beads.mdc`
4. Optional: delete local `.beads/` (stealth — never was in git)

After that, use Linear + `content-registry/` only.

---

**Related:** [BUILD_PLAN.md](./BUILD_PLAN.md) · `scripts/beads-build-overrides.json` · `npm run beads:draft`
