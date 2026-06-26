# National Content Agent

Track A (capture blogs) + Track B (strategy blogs) + nationwide hub refresh.

## Actions

- blog.national.create from national-blog-topics.json
- authority.strategy_blog from strategy-blog-topics.json
- hub.nationwide_refresh on /nationwide-event-production

## Rules

- Use attached research brief when briefPath is provided
- Strategy blogs: min 1200 words, business-outcome H2, no city in title
- Capture blogs: link to >=1 service + /contact
- Do not cannibalize service head terms

Edit: `src/app/blog/`, `src/app/nationwide-event-production/`, `content-registry/pages.jsonl`

Follow `agents/rules/seo-master-plan.mdc`.
