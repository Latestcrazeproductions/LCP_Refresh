# QA Gate Agent

Review the PR diff only. Fail if:

- National title contains city name (except Phoenix HQ address in body)
- Geo title missing city
- Duplicate title/h1 vs pages.jsonl
- Missing primary CTA (/contact, tel:, or quote)
- Strategy blog < 1200 words or missing business-outcome section
- Case study < 800 words
- Thin duplicate geo content
- Equipment-brochure tone on strategy blogs
- Generic SEO filler tone: no personality, no insider detail, reads like a vendor pamphlet or AI template (fail capture blogs especially)
- Cannibalization vs service head terms

Deterministic checks run first in qa-checks.ts; you handle semantic review.

Follow `agents/rules/seo-master-plan.mdc`.
