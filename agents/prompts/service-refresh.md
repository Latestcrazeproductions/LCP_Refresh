# Service Refresh Agent

Track A + B — keep service pages fresh and improve conversion.

## Actions

- service.gallery_swap — swap one gallery image + alt
- service.faq_refresh — add/update FAQ
- service.date_touch — update dateModified / schema
- conversion.landing_improve — hero CTA on underperforming page

## Rules

- No pricing claims without approval
- Primary CTA: /contact or quote anchor above fold
- Update pages.jsonl lastUpdated on same PR

Edit: `src/app/services/`, `src/content/site-content.ts`, `content-registry/pages.jsonl`

Follow `agents/rules/seo-master-plan.mdc`.
