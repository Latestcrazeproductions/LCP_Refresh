# SEO & AI Visibility Analysis — Latest Craze Productions (latestcrazeproductions.com)

*Generated from Semrush API data and site audit — March 2026*

---

## Executive Summary

| Metric | Current | Target |
|--------|---------|--------|
| Organic keywords | **0** | 50+ |
| Organic traffic | **0** | Measurable |
| Domain rank | **0** | Top 1M |
| Backlinks | 103 | 500+ quality |
| Referring domains | 71 | 100+ authority |

**Verdict:** The site has **no measurable organic search visibility**. Backlinks exist (103) but many are low-quality directory/spam links. SEO and AI discoverability improvements are needed across the board.

---

## Semrush API Findings

### Domain Overview
- **Organic keywords:** 0
- **Organic traffic:** 0
- **Organic cost (value):** $0
- **Rank:** 0 (not in top 10M)

### Backlinks
- **Total:** 103
- **Referring domains:** 71
- **Follow vs nofollow:** 71 follow, 32 nofollow
- **Quality concern:** Many links from low-authority domains (e.g. `domainwork.space`, `all-aged-domains.com`, `queries.co.in`, generic directory sites). Some may be spam; consider disavowing toxic links.

### Keywords & Content
- No organic keyword rankings.
- No top pages with traffic.

---

## Traditional SEO Fixes (Priority Order)

### 1. Content & On-Page
- [ ] **Lead with direct answers** — LLMs and snippets favor first 100–150 words. Put “what we do” and key value props upfront.
- [ ] **Add more indexable pages** — Currently only the homepage is in the sitemap. Add `/services`, `/events`, `/about`, `/contact` as distinct pages with unique titles, meta descriptions, and H1s.
- [ ] **Target intent keywords** — e.g. “corporate event production Phoenix”, “LED video wall rental”, “event AV company”, “corporate gala production”.
- [ ] **Implement H2/H3 hierarchy** — Clear headings improve both search and AI parsing.

### 2. Technical SEO
- [ ] **Verify robots.txt / sitemap** — Already in place. Ensure `NEXT_PUBLIC_SITE_URL` is set correctly in production.
- [ ] **Canonical URLs** — Layout has `metadataBase` and canonical; maintain for any new pages.
- [ ] **Image alt text** — Ensure all hero, service, and event images have descriptive `alt` attributes.

### 3. Backlinks
- [ ] **Audit backlink profile** — Use Semrush/Google Search Console to identify toxic links; disavow spam domains.
- [ ] **Build quality links** — Partner with event industry sites, venue directories, vendor networks, and local business listings. Replace quantity with authority.

### 4. Local SEO
- [ ] **Google Business Profile** — Claim and optimize for “Latest Craze Productions” in Phoenix.
- [ ] **NAP consistency** — Ensure name, address, phone match exactly across the site, GBP, and directories.

---

## AI / LLM Optimization (GEO)

AI engines (ChatGPT, Perplexity, Gemini, Google AI Overviews) use different signals than traditional search. Optimizing for **Generative Engine Optimization (GEO)** can improve visibility in AI answers.

### 1. Structured Data (JSON-LD) — Critical

**Current state:** Only a basic `Organization` schema on the homepage.

**Recommended additions:**

| Schema Type | Purpose |
|-------------|---------|
| `LocalBusiness` (extends Organization) | Local relevance and map panels |
| `Service` | For each service (video walls, lighting, stage design) |
| `FAQPage` | Common questions (budget, lead time, cities served) |
| `Event` | For case studies or past events, if applicable |

**Rules:**
- Schema must **mirror visible content**. Do not add hidden claims.
- Use JSON-LD in a `<script type="application/ld+json">` tag.

### 2. Content Structure for AI Citation
- **Direct answers in first 150 words** — State who you are and what you do immediately.
- **Entity clarity** — Use consistent “Latest Craze Productions” and “Latest Craze” with clear context.
- **Factual, quotable statements** — LLMs cite specific claims. Use clear, factual sentences.

### 3. Entity Authority
- **Brand mentions on 50+ authoritative domains** — Press, partner sites, industry directories, awards.
- **Consistent NAP** — Name, address, phone in schema and visible on page.
- **sameAs** — Add real social and directory URLs (LinkedIn, Crunchbase, industry sites).

### 4. Schema Nesting
- Implement nested entities: `Organization` → `ContactPoint`, `Address`, `Service`, `founder`/`employee`.
- This helps AI build a knowledge graph around the brand.

---

## Implementation Roadmap

### Phase 1: Quick Wins (1–2 days) ✅
1. ✅ Add `LocalBusiness` and richer `Organization` schema.
2. ✅ Add `FAQPage` with 5–8 common questions.
3. ✅ Add `Service` schemas for core offerings.
4. ✅ Audit and add missing `alt` attributes on images.

### Phase 2: Content & Structure (1–2 weeks)
1. Split homepage into logical sections with H2/H3 headings.
2. Add dedicated pages: `/services`, `/events`, `/about`, `/contact`.
3. Write unique meta titles and descriptions per page.
4. Add lead-paragraph “direct answer” for each page.

### Phase 3: Authority & Backlinks (ongoing)
1. Disavow toxic backlinks.
2. Build links from event industry and local directories.
3. Populate `sameAs` with real profiles.
4. Create shareable content (case studies, event guides).

### Phase 4: Monitoring
1. Run Semrush reports monthly.
2. Track AI visibility (manual searches in ChatGPT, Perplexity, etc.).
3. Use Google Search Console for indexation and queries.

---

## Semrush Report Usage

To regenerate this analysis with fresh Semrush data:

1. Start the backend: `cd semrush-report && source venv/bin/activate && python run_backend.py`
2. Open the CMS at `/cms/login`, go to **SemRush Reports**.
3. Enter domain (e.g. `latestcrazeproductions.com`) and click **Generate New Report**.
4. Review overview, keywords, backlinks, competitors, traffic, and content.

---

## References

- [Semrush API Documentation](https://developer.semrush.com/api/)
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)
- [JSON-LD for SEO & AI](https://developers.google.com/search/docs/appearance/structured-data)
- [LLM Optimization Best Practices](https://seenos.ai/llm-optimization/llm-optimization-best-practices)
