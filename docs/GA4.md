# Google Analytics 4

GA4 is the traffic and engagement layer for the inbound engine (funnel step 3 in [TECHNICAL_OVERVIEW.md](./TECHNICAL_OVERVIEW.md)). It does not replace Search Console.

## Create the property (once)

1. Open [Google Analytics](https://analytics.google.com) with the same Google account that owns Search Console for `latestcrazeproductions.com`.
2. **Admin → Create → Property**. Name it `Latest Craze Productions`. Time zone `America/Phoenix`. Currency USD.
3. Create a **Web** data stream. URL `https://latestcrazeproductions.com`.
4. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
5. Under the stream, **Configure tag settings → Linked products** (or Admin → Product links) and link **Search Console** for the URL-prefix property `https://latestcrazeproductions.com/`.

## Wire the site

Set on Vercel **Production** (and Preview if you want staging data separate):

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Redeploy after adding it. `NEXT_PUBLIC_*` is baked in at build time.

Locally, add the same line to `.env.local`. The tag is a no-op if the env var is missing or not a `G-` id.

## What the site sends

| When | Event | Notes |
|------|--------|--------|
| Page load | Consent Mode `analytics_storage=granted` | Opt-out: no banner click required. **Reject non-essential** turns it off. |
| Each route (including client navigations) | `page_view` | Skipped only after an explicit analytics opt-out |
| Contact form success | `generate_lead` | Params: `event_type`, `referral_source`. No PII |

Marketing cookies map to Google `ad_storage` / ads personalization. They stay denied unless the visitor accepts marketing.

## Where to read engagement

In GA4 **Reports** (wait 24–48 hours after the first live hits):

1. **Engagement → Pages and screens** — landing pages under `/blog/` and `/work/`
2. **Acquisition → Traffic acquisition** — Session source/medium; filter `google / organic`
3. **Engagement → Events** — `page_view` and `generate_lead`
4. **Explore → Free form** — landing page × session source/medium × `generate_lead`

Mark `generate_lead` as a **key event** (Admin → Events) so it shows in conversion reports.

## Monthly actuals

Copy into `content-registry/metrics.json`:

- `monthlyOrganicSessions` — Traffic acquisition, last calendar month, `google / organic`
- `monthlyOrganicLeads` — `generate_lead` count for that month (still reconcile with Supabase `contact_submissions`; GA4 misses visitors who rejected analytics)
