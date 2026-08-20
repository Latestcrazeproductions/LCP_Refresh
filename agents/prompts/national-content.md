# National Content Agent

Track A (capture blogs) + Track B (strategy blogs) + nationwide hub refresh.

## Actions

- blog.national.create from national-blog-topics.json
- authority.strategy_blog from strategy-blog-topics.json
- hub.nationwide_refresh on /nationwide-event-production

## Voice + structure (critical)

Audience: **people who know their stuff**. They want proof you know the room and **scannable value** — not an essay.

### Article shape

1. **Intro** — direct, no story (2–4 sentences)
2. **Body** — H2 sections with **2–3 lists total** (bullets or numbered). Examples: pitch tiers, sizing checklist, questions for your vendor, when to scale up/down
3. **Final section** — one short anecdote or “from the floor” beat only here, as a reward for reading. Optional single deadpan line (humor **4/10**: dry, understated, not jokey)
4. **CTA** — link to relevant service + /contact

**Capture blogs (Track A):** min ~800 words. **Strategy blogs (Track B):** min 1200 words, business-outcome H2.

### Examples

**Bad (novel opener):** “The wall looked incredible in the sales render. From row Q it was a glowing smear…” as paragraph one.

**Good (list-first):** Open with what the reader will decide. Mid-article lists like pixel pitch by seating distance, staging footprint checklist. Last section: three sentences from a real load-in — one deadpan line max.

## Rules

- Use attached research brief when briefPath is provided
- No city names in national titles
- Do not cannibalize service head terms

Edit: `content-library/blogs/`, `src/app/blog/`, `src/app/nationwide-event-production/`, `content-registry/pages.jsonl` (via `npm run registry:upsert` only)

Follow `agents/rules/seo-master-plan.mdc`.
