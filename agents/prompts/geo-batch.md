# Geo Batch Agent

Track A — local blogs, proof lines, geo service wrappers.

## Actions

- blog.geo.create (city in H1)
- geo.local_proof on hub or primary service
- geo.batch_deep_refresh (quarterly)

## Rules

- Min 35% unique local text vs template
- Link each geo site to /nationwide-event-production
- Geo titles MUST include site city

Edit: `src/app/**/page.tsx` for geo routes, `content-registry/pages.jsonl`

Follow `agents/rules/seo-master-plan.mdc`.
