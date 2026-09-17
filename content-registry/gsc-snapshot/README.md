# GSC snapshot (v1, no paid tools)

Monthly Google Search Console exports live here so ResearchAgent can steer from queries Google already sends. Do **not** treat a missing CSV as zero impressions.

## Folder convention

```text
content-registry/gsc-snapshot/YYYY-MM/
  STATUS.json     # period metadata + export status
  queries.csv     # Performance → Queries (required)
  pages.csv       # Performance → Pages (required)
```

`YYYY-MM` is the **performance period** (last complete calendar month), not the commit date. Optional files from the same GSC zip (`countries.csv`, `devices.csv`, `search-appearance.csv`, `Filters.csv`) may sit alongside; the orchestrator only requires `queries.csv` and `pages.csv` (case-insensitive).

Current pending period: **2026-08** (`2026-08-01` through `2026-08-31`).

## What Steve pastes (exact export)

No GSC/GA4/Supabase API credentials are in the agent environment. Fill the three sources below, then commit the CSVs + update `content-registry/metrics.json` actuals on a `feature/*` branch into `development`.

### 1. Search Console → `2026-08/` CSVs

1. Open [Search Console](https://search.google.com/search-console) and select URL-prefix property `https://latestcrazeproductions.com/`.
2. **Performance → Search results**.
3. Date: **Custom → 1 Aug 2026 – 31 Aug 2026**. Search type: **Web**.
4. Top-right **Export** → **Download CSV** (zip).
5. Unzip into `content-registry/gsc-snapshot/2026-08/`.
6. Rename so the required names exist:
   - `Queries.csv` → `queries.csv`
   - `Pages.csv` → `pages.csv`
7. Set `STATUS.json` `"status"` to `"present"`. Leave `STATUS.json` in the folder.

Expected CSV headers (GSC Performance export):

```text
Top queries,Clicks,Impressions,CTR,Position
Top pages,Clicks,Impressions,CTR,Position
```

### 2. GA4 → `metrics.json` actuals

Property / stream: **`G-W2K2ZKCHVZ`**. Date range: **1 Aug 2026 – 31 Aug 2026**.

| Paste into | GA4 path |
|------------|----------|
| `actuals.monthlyOrganicSessions` | **Reports → Acquisition → Traffic acquisition**, filter Session source/medium `google / organic`, copy **Sessions** |
| `generate_lead` count (reconcile) | **Reports → Engagement → Events** → event name `generate_lead`, copy **Event count** |

Do not use total Sessions (all channels). Do not use the March 2026 Semrush “0 organic keywords” sidecar.

### 3. Supabase → lead actuals

Production project `qsccsddknmvidvcfpffu`, table `contact_submissions`.

1. Table Editor → filter `created_at` **on or after** `2026-08-01` **and before** `2026-09-01`.
2. Copy the **row count only** (no names, emails, or message bodies).
3. Put that count in `actuals.monthlyOrganicLeads` (real inquiries). If it differs from GA4 `generate_lead`, keep both numbers in the PR description — GA4 misses opted-out visitors.

`targets` stay leadership-owned. Do not invent them in this folder.

## After paste

1. `actuals.lastUpdated` = the UTC date you exported (`YYYY-MM-DD`).
2. Leave a metric **null** if that source was not exported. Null means unknown, not zero.
3. Open a PR into **`development`** only.
