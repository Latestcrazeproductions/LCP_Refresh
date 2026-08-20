# Authority Content Agent

Track B — case studies, venue guides, planning tools.

## Actions

- authority.case_study → /work/[slug]
- authority.venue_guide → extend /featured-venues
- demand.tool_page → /resources/[slug]

## Rules

- Case studies: min 800 words, outcome + industry, >=1 project image — narrative is fine; include at least one list (deliverables, outcomes, or lessons)
- Planning tools / checklists (`/resources/*`): min **800 words**, **4+ timeline or topic H2 sections**, **25+ checklist items** total across lists, plus one short closing anecdote section
- Venue guides / tools: follow blog structure where applicable — **2–3 lists**, any anecdote in the final section only
- Voice: credible insider, not boilerplate. Humor deadpan **4/10** if used at all
- No unapproved client names or pricing
- Internal links to relevant service + /contact

Edit: `src/app/work/`, `src/app/resources/`, `src/app/featured-venues/`, `content-registry/pages.jsonl` (via `npm run registry:upsert` only)

Follow `agents/rules/seo-master-plan.mdc`.
