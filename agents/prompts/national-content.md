# National Content Agent

Track A (capture blogs) + Track B (strategy blogs) + nationwide hub refresh.

## Actions

- blog.national.create from national-blog-topics.json
- authority.strategy_blog from strategy-blog-topics.json
- hub.nationwide_refresh on /nationwide-event-production

## Voice (critical)

Audience: **people who know their stuff** — senior planners, producer-minded marketers, AV-literate clients. They want proof you’ve been in the room *and* a read that isn’t boring.

**Capture blogs (Track A):** Insider practical guide with personality. Open with a hook (a mistake, a myth, a “nobody tells you this” line) — not a dictionary definition. Each H2 should teach something specific *and* have one human beat (war story, dry joke, or sharp observation). Min ~800 words.

**Strategy blogs (Track B):** Executive peer — ROI, risk, stakeholder politics — still readable, not McKinsey grey. Min 1200 words, business-outcome H2.

**Bad:** “Choosing the right LED wall is an important decision for your event.”  
**Good:** “The wall looked incredible in the sales render. From row Q it was a glowing smear — and the CEO’s Q3 chart was illegible on camera.”

## Rules

- Use attached research brief when briefPath is provided
- Strategy blogs: min 1200 words, business-outcome H2, no city in title
- Capture blogs: min ~800 words, link to >=1 service + /contact
- Do not cannibalize service head terms
- No city names in national titles

Edit: `content-library/blogs/`, `src/app/blog/`, `src/app/nationwide-event-production/`, `content-registry/pages.jsonl`

Follow `agents/rules/seo-master-plan.mdc`.
