# SEO Improvement Plan — Strategic Gap Analysis

> **Status (June 2026):** All five missing layers identified below are now mapped to concrete task types, agents, registry files, and QA rules in [AGENT_SEO_AUTOMATION.md](./AGENT_SEO_AUTOMATION.md) § Track B. This document remains the strategic rationale; the automation spec is the implementation source of truth.

Looking strictly at the business outcome—“generate so much inbound demand that LCP can eventually support a dedicated inbound sales team”—this plan is very thorough operationally, but there is a gap between publishing content and creating demand.

## What the plan does extremely well

Most SEO automation plans fail because they stop after “publish more content.”

Your plan addresses:

- Content production
- Content freshness
- Internal linking
- Geo expansion
- QA
- Governance
- Publishing cadence
- Anti-cannibalization
- Structured scaling from 10 → 100 locations

That means you’ve largely solved the problem of:

“How do we continuously create and maintain a large SEO footprint?”

That’s valuable.

---

## The bigger question

Will this create enough inbound demand to build an inbound sales force?

Maybe. But not because of volume alone.

The plan is heavily weighted toward:

- content creation
- content maintenance
- freshness signals

And relatively light on:

- commercial intent
- conversion architecture
- authority building

Those three things usually determine whether SEO becomes a lead engine.

---

## Missing Layer 1: Search Demand Math

I don’t see a section asking: How many searches actually exist?

Example — if you rank #1 nationally for LED wall rental company, AV production company, conference AV company, event production company, corporate event production: how many annual searches, leads, closes, and salespeople does that support?

Without this math it’s possible to publish 5,000 pages, rank for 5,000 keywords, generate 20 leads/month, and technically “succeed.”

**Recommended:** Revenue Model section tracking monthly organic sessions, MQLs, sales calls, closed revenue, revenue per visit — work backward from “5 inbound sales reps.”

---

## Missing Layer 2: Authority

Google rewards links, brands, mentions, authority — not just pages.

Case studies, venue pages, partnerships, press, conference recaps may produce more business than 300 geo pages. Examples: Night of Hope, New Pathways, Amazon Fireside Chat, Heard Museum.

---

## Missing Layer 3: Conversion Infrastructure

When somebody lands on “Denver Event Production Company,” what happens? The plan assumes traffic becomes leads. Automated CTA coverage audits required — every page must answer “what should this visitor do next?”

---

## Missing Layer 4: Topic Ownership

Become the authority on event strategy — outcomes, attendee experience, business impact — not just “LED Wall Rental Phoenix.” Executive-level topics executives search before they hire anyone.

---

## Missing Layer 5: Demand Capture vs Demand Creation

The plan is mostly demand capture. Also need demand creation: planning templates, calculators, checklists, venue tools — assets that earn backlinks, subscribers, repeat visitors.

---

## Assessment grades

| Area | Grade |
|------|-------|
| SEO Operations | 9/10 |
| Content Scaling | 9/10 |
| Conversion Strategy | 5/10 |
| Authority Building | 4/10 |
| Demand Creation | 3/10 |
| Revenue Attribution | 4/10 |

**Core observation:** The plan is optimized to create more pages. The stated goal is to create more qualified buyers. Those overlap, but they are not the same thing.

**Recommended workstream:** Authority & Demand Engine — case studies, venue guides, strategy content, calculators, planning tools, customer stories.

---

## Resolution (mapped to automation spec)

| Missing layer | Implementation in AGENT_SEO_AUTOMATION.md |
|---------------|-------------------------------------------|
| 1. Search demand math | `metrics.json`, `keywordTAM.json`, `demand-math.ts`, `metrics.monthly_review` |
| 2. Authority | AuthorityContentAgent, `authority.case_study`, `authority.venue_guide`, case-studies manifest |
| 3. Conversion | `conversion.cta_audit`, `conversion.landing_improve`, CTA rules in `qa-checks.ts` |
| 4. Topic ownership | `authority.strategy_blog`, `strategy-blog-topics.json` |
| 5. Demand creation | `demand.tool_page`, tools library, `/resources/[slug]` routes |

See also [CEO Alignment Brief](./CEO_ALIGNMENT_BRIEF.md), [CEO Executive Summary](./CEO_EXECUTIVE_SUMMARY.md), and [Product Implementation Plan](./PRODUCT_IMPLEMENTATION_PLAN.md).
