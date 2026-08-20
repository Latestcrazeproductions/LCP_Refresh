# Image Inventory — Inbound Marketing System

**Scope:** Images for the **inbound sales / SEO automation program** only — new marketing pages agents will create and the layouts already built for them.

**Out of scope:** The existing marketing site (homepage, `/services`, `/events`, `/about`, `/contact`, etc.). Those pages already have images in the CMS; they are not loading locally because you are on the dev database. No action needed here for the inbound program.

**Related:** [AGENT_SEO_AUTOMATION.md](./AGENT_SEO_AUTOMATION.md) · Feed layout: `src/components/layout/FeedLanding.tsx`

---

## Marketing pages in this system

| Route group | Track | Registry status | Image status |
|-------------|-------|-----------------|--------------|
| `/feeds/*` | A | 1,110 planned | Placeholders (`FeedLanding`) |
| `/blog`, `/blog/[slug]` | A (+ B strategy) | Hub live; 1 post | Placeholders (`ContentHubIndex` / `ArticleLayout`) |
| `/work`, `/work/[slug]` | B | Hub live; 1 case study | Placeholders |
| `/resources`, `/resources/[slug]` | B | Hub live; 1 tool | Placeholders |
| `/nationwide-event-production` | A | Planned hub | Not built |
| `/markets` | A | Planned index | Not built |
| Geo feed pages (`/feeds/{service}/{city}`) | A | Phase 2 in registry | Placeholders when built |

**Preview feeds live today (layout critique):** `/feeds`, `/feeds/event-production`, `/feeds/av-production-galas-awards`, `/feeds/led-walls`, `/feeds/av-production/phoenix-az`

**Queued content (manifests, no images yet):** `heard-museum-gala` case study; additional blogs/tools from `content-library/topics/`

---

## Image slots per page type

Every inbound layout uses the same slot model. Count **slots**, not unique photos at scale.

| Page type | Layout component | Slots | Notes |
|-----------|------------------|-------|-------|
| Feed landing | `FeedLanding` | **3** | Hero + 2 alternating sections |
| Hub index (`/blog`, `/work`, `/resources`) | `ContentHubIndex` | **1 + (2 × N)** | 1 hub banner + per-item card thumbnail + article hero when opened |
| Article / case study / resource | `ArticleLayout` | **1** hero (+ optional inline later) | Card reuses `cardImage` or `heroImage` |
| Nationwide hub | TBD (same as feed) | **3–4** | Hero + 2–3 proof sections |
| Markets index | TBD | **1 + N** | Index hero + 1 card image per market |

### Current live inbound pages (concrete count)

| Page | Slots today |
|------|-------------|
| `/blog` | 1 hub banner + 1 card = **2** |
| `/blog/corporate-gala-production-guide` | 1 hero = **1** |
| `/work` | 1 + 1 = **2** |
| `/work` | Index when case studies exist |
| `/resources` | 1 + 1 = **2** |
| `/resources/event-production-checklist` | 1 hero = **1** |
| 4 feed previews | 4 × 3 = **12** |
| **Subtotal now** | **21 placeholder slots** |

### At full program scale (planning)

| Surface | Pages | Slots/page | Unique assets strategy |
|---------|-------|------------|------------------------|
| Feed matrix | 1,110 | 3 | **~120–150 library** images, assigned by taxonomy |
| Hubs (static) | 3 | 1 each | **3** hub banners |
| Blogs | ~55% of new content mix | 2 each | **1–2 per article** (hero + card; can be same file) |
| Case studies | Track B | 2–4 each | **Project-specific** (client approval required) |
| Resources / tools | Track B | 2 each | Abstract/planner visuals OK |
| Nationwide + markets | 2 + 10 markets | 3–4 + 1 | **~15** hub/market images |
| Geo pilot (10 cities) | Phase 2 | 3 per primary feed | Reuse library + **1–2 local proof** per city |

**Do not plan 3,330 feed photos** (1,110 × 3). Use a shared library and programmatic assignment.

---

## Feed image library (taxonomy)

Build one library under `public/images/marketing/library/`. Each file is tagged in a manifest; `resolveFeedImages()` picks hero + sections from tags on the registry row (`pattern`, `service`, `eventType`, `industry`, `location`).

### Library buckets to create

| Bucket | ID prefix | Count | Used on |
|--------|-----------|-------|---------|
| Head services | `head-{event-production\|conference-production\|av-production}` | 3 | `head-service` (3 pages) |
| Core services | `core-{led-walls\|event-lighting\|…}` | 7 | `core-service` (7 pages) |
| Niche services | `niche-{gobos\|digital-signage}` | 2 | Niche patterns (24 pages) |
| Event types | `event-{galas-awards\|corporate-keynotes\|…}` | 10 | All `*-event` patterns (900+ pages) |
| Industries | `industry-{pharmaceutical\|automotive\|…}` | 9 | `service-industry*` (910 pages) |
| Arizona geo | `geo-{phoenix-az\|scottsdale-az\|…}` | 5 × 2 | `service-location` AZ (35 pages) |
| US markets | `market-{dallas-tx\|atlanta-ga\|…}` | 10 × 1 | `head-service-market` (30 pages) |
| Cross-ref | `geo-phoenix-scottsdale-hub` | 1 | Phoenix ↔ Scottsdale hub |
| Partner / PR | `audience-pr-agencies` | 1 | Agency-facing feed |

**Phase 1 library target:** **~120–150 masters**  
**Phase 2:** +10 local proof packs (pilot cities)  
**Phase 3:** Case-study and client-specific overrides where approved

### Feed patterns → which library tags apply

| Pattern | Pages | Hero priority | Section fallbacks |
|---------|-------|---------------|-------------------|
| `head-service` | 3 | `head-{service}` | `event-corporate-keynotes`, generic production |
| `head-service-event` | 30 | `head-{service}` + `event-{type}` | Alternate event shot |
| `core-service` | 7 | `core-{service}` | Integrated stage wide shot |
| `core-service-event` | 70 | `core-{service}` + `event-{type}` | Same |
| `service-industry` | 90 | `core/head` + `industry-{id}` | Industry context |
| `service-industry-event` | 820 | Best match on 3 tags | Heavy reuse |
| `service-location` | 35 | `geo-{location}` + service | Local venue / load-in |
| `head-service-market` | 30 | `market-{city}` + `head-{service}` | Skyline or ballroom |
| `location-crossref` | 1 | `geo-phoenix-scottsdale-hub` | Resort + downtown |

---

## Authority content (Track B) — per-piece images

These need **unique or semi-unique** images (credibility). Sourced from real projects when Phase 0.6 client assets are cleared.

| Content | Slug (now / queued) | Images needed | Brief |
|---------|---------------------|---------------|-------|
| Capture blog | `corporate-gala-production-guide` | Hero + card (1–2) | Planner-focused gala / ballroom |
| Case study | `heard-museum-gala` (queued) | Hero + 2 section (3) | Gala stage, LED, awards flow |
| Case study | `heard-museum-gala` (queued) | Hero + 2 section (3) | Arts gala, premium production |
| Resource | `event-production-checklist` | Hero + card (1–2) | Clean planner / timeline aesthetic |
| Strategy blogs | From `strategy-blog-topics.json` | 2 each | Business-outcome tone, not stock concert crowds |
| Future tools | From `tools/manifest.json` | 2 each | Checklist, calculator, worksheet visuals |

**Rule:** Case study heroes must be **approved client event photography**. Blogs and resources can use library shots or light abstract graphics until real assets exist.

---

## Hub banners (static, 3 images)

Configured in `src/lib/content-hubs.ts` today as labels only. Replace with paths when assets exist.

| Hub | Config key | Suggested subject |
|-----|------------|-------------------|
| `/blog` | `blogs.imageLabel` → `image` | Editorial — production planning, neutral corporate |
| `/work` | `work.imageLabel` → `image` | Portfolio — flagship stage moment |
| `/resources` | `resources.imageLabel` → `image` | Tools — checklist / timeline aesthetic |

---

## Planned hubs (not built yet)

| Route | Images | Brief |
|-------|--------|-------|
| `/nationwide-event-production` | Hero + 2–3 sections | US map / touring crew / consistent technical standard |
| `/markets` | Index hero + 1 per market (10) | City skyline or signature venue per `NATIONWIDE_MARKETS` |

These reuse `market-{slug}` library assets where possible.

---

## How we will implement images

### 1. Storage layout (git + `public/`)

Inbound marketing images live **outside** the CMS. Agents and PRs add files here; no Supabase dependency.

```
public/images/marketing/
├── library/                    # Reusable feed pool (taxonomy-named)
│   ├── head-event-production.jpg
│   ├── core-led-walls.jpg
│   ├── event-galas-awards.jpg
│   ├── industry-automotive.jpg
│   ├── geo-phoenix-az.jpg
│   └── market-dallas-tx.jpg
├── hubs/
│   ├── blog-banner.jpg
│   ├── work-banner.jpg
│   └── resources-banner.jpg
├── articles/                   # Blog-specific (optional override)
│   └── corporate-gala-production-guide-hero.jpg
├── case-studies/               # Track B — client-approved
│   ├── night-of-hope-hero.jpg
│   └── night-of-hope-awards.jpg
└── resources/
    └── event-production-checklist-hero.jpg
```

### 2. Manifest (machine-readable assignment)

New file: `content-library/image-library/manifest.json`

```json
{
  "assets": [
    {
      "id": "core-led-walls",
      "src": "/images/marketing/library/core-led-walls.jpg",
      "alt": "Ultra-wide LED video wall at a corporate keynote",
      "tags": { "services": ["led-walls"], "events": ["corporate-keynotes", "product-launches"] }
    }
  ]
}
```

Registry row + manifest tags → `resolveFeedImages(entry)` returns `{ hero, sections: [a, b] }`.

### 3. Markdown frontmatter (blogs, work, resources)

Extend `content-library/{blogs,work,resources}/*.md`:

```yaml
---
title: Night of Hope — Corporate Gala Production
heroImage: /images/marketing/case-studies/night-of-hope-hero.jpg
cardImage: /images/marketing/case-studies/night-of-hope-card.jpg
heroAlt: "Night of Hope gala stage with LED wall and awards lighting"
sectionImages:
  - /images/marketing/case-studies/night-of-hope-approach.jpg
  - /images/marketing/case-studies/night-of-hope-outcome.jpg
---
```

Wire through `src/lib/markdown-pages.ts` → `ArticleLayout` / `ContentIndexCard` (replace `ImagePlaceholder` when `src` is set).

### 4. Hub config

Add optional `image` + `imageAlt` to `CONTENT_HUBS` in `src/lib/content-hubs.ts`.

### 5. Feed pages

`src/lib/feed-images.ts` (to build):

- Input: `FeedRegistryEntry` from `feed-registry.ts`
- Output: `{ hero: SeoImage, sections: [SeoImage, SeoImage] }`
- Fallback: `ImagePlaceholder` with label (current behavior)

`FeedLanding.tsx` already has three slots; swap placeholder for `<Image>` when resolver returns a path.

### 6. Agent workflow

| Agent | Image responsibility |
|-------|---------------------|
| NationalContentAgent | Set frontmatter paths on new blogs; must use existing library IDs or add new files + manifest row in same PR |
| AuthorityContentAgent | Case study images only from approved assets list; never pull from web |
| GeoBatchAgent | Prefer `geo-{city}` library tags; add `localProofImage` frontmatter on geo blogs when new local shot exists |
| ServiceRefreshAgent | No new image types — may swap gallery on **existing** `/services` via CMS (out of scope here) |
| QA gate | Fail PR if `heroImage` path missing on disk, or alt empty on new/changed marketing pages |

### 7. Programmatic generation (later)

When you add AI/generated images:

1. Generate into `public/images/marketing/library/` using manifest `id` as filename  
2. Append row to `manifest.json` with tags  
3. No per-page file churn — resolver picks up new library assets automatically  

---

## Specs (inbound pages only)

| Slot | Aspect | Min size | Format |
|------|--------|----------|--------|
| Feed / article hero | 21:9 or 16:9 | 1600×900 | WebP or JPG |
| Feed section | 16:10 | 1280×800 | WebP or JPG |
| Hub banner | 21:9 | 1920×820 | WebP or JPG |
| Card thumbnail | 16:10 | 800×500 | WebP or JPG |
| Case study inline | 16:9 | 1200×675 | WebP or JPG |

Alt text: `{Page title} — Latest Craze Productions` or manifest `alt` field. Must match visible content (schema parity).

---

## Phased sourcing (inbound only)

### Phase 0 — Unblock layout review → first agent PRs (~25 images)

1. Three hub banners  
2. Library seed: 3 head + 7 core + 10 event = **20**  
3. Sample article/case study heroes for the 3 live markdown pages (**3–6**)  

Enough to turn off placeholders on hubs, previews, and sample content.

### Phase 1 — National feed launch (~80 more)

4. Industry pack (9)  
5. Head×event and core×event composite variants (**~40**)  
6. Nationwide hub + markets index (**~12**)  
7. First real case study set when client clears assets  

### Phase 2 — Geo pilot (~30–50)

8. Arizona geo pack (5 cities × 2–3)  
9. Top 10 market establishing shots  
10. Local proof per pilot city (1–2 each)  

### Ongoing

- **+2 images per new blog** (hero + card, can duplicate)  
- **+3–4 per case study** (client-approved)  
- **+1–2 per resource/tool**  
- Expand library, not per-URL files, for new feed patterns  

---

## Implementation checklist (engineering)

- [ ] Create `content-library/image-library/manifest.json`  
- [ ] Create `src/lib/feed-images.ts` resolver  
- [ ] Extend markdown frontmatter: `heroImage`, `cardImage`, `heroAlt`, `sectionImages`  
- [ ] Update `FeedLanding`, `ArticleLayout`, `ContentIndexCard`, `ContentHubIndex` to render real images when present  
- [ ] Add `image` fields to `content-hubs.ts`  
- [ ] QA check: marketing image path exists + alt present (`scripts/seo-orchestrator/src/qa-checks.ts`)  
- [ ] Document manifest tagging rules in `agents/prompts/national-content.md` and `authority-content.md`  

---

## Quick reference — files to touch

| Concern | File |
|---------|------|
| Feed layout slots | `src/components/layout/FeedLanding.tsx` |
| Hub / article slots | `src/components/layout/ContentHubIndex.tsx`, `ArticleLayout.tsx`, `ContentIndexCard.tsx` |
| Sample feed copy | `src/content/feed-examples.ts` (interim; resolver replaces) |
| Hub copy + future banner paths | `src/lib/content-hubs.ts` |
| Markdown parsing | `src/lib/markdown-pages.ts` |
| URL registry | `content-registry/pages.jsonl` |
| Case study queue | `content-library/case-studies/manifest.json` |
| Tools queue | `content-library/tools/manifest.json` |
