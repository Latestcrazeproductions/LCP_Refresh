# Supabase — development vs production

## Projects

| Environment | Supabase project | Project ref | Used by |
|-------------|------------------|-------------|---------|
| **Production** | Latestcrazeproductions's Project | `qsccsddknmvidvcfpffu` | `main` → live site, Vercel **Production** |
| **Development** | LCP Development | `aafiingdoulyghucrzat` | git `development`, Vercel **Preview**, local dev |

> **Note:** Supabase **branching** requires Pro. A separate **LCP Development** project was created instead (same schema via migrations, isolated CMS data).

---

## Local development (git `development`)

1. Copy env template (once):

   ```bash
   cp .env.development.example .env.development.local
   ```

2. Add dev **service role** to `.env.development.local` (CMS settings / server routes):

   Supabase Dashboard → **LCP Development** → Settings → API → `service_role` →  
   `SUPABASE_SERVICE_ROLE_KEY=...`

3. Create a **CMS user** in LCP Development (Auth → Users) — do not use production credentials.

4. Run the app:

   ```bash
   npm run dev
   ```

   Next.js loads `.env.development.local` automatically in development mode.

---

## Vercel (Preview deployments from `development`)

Set **Preview** environment variables (not Production):

| Variable | Development value |
|----------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://aafiingdoulyghucrzat.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_danPW6_6Ry-iSmlJjNNrCA_OzFP3EzO` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role from **LCP Development** dashboard |

**CLI** (after `vercel login`):

```bash
chmod +x scripts/setup-vercel-dev-env.sh
./scripts/setup-vercel-dev-env.sh

# Service role keys (from Supabase → Settings → API) — not in git:
vercel env add SUPABASE_SERVICE_ROLE_KEY production --value YOUR_PROD_SERVICE_ROLE -y --non-interactive --sensitive
vercel env add SUPABASE_SERVICE_ROLE_KEY preview "" --value YOUR_DEV_SERVICE_ROLE -y --non-interactive --sensitive
```

Preview vars use `preview ""` (empty third arg) so they apply to **all** Preview branches without an interactive prompt.

Vercel does **not** allow `--sensitive` vars on the **Development** target (used by `vercel dev`). Use `.env.development.local` for local service role instead.

**Dashboard:** Vercel → Project → Settings → Environment Variables → add each variable → check **Preview** only.

Production variables must remain pointed at `qsccsddknmvidvcfpffu`.

---

## Schema migrations

Migrations live in `supabase/migrations/`. Apply to dev first, then production at go-live.

**Development project:**

```bash
supabase link --project-ref aafiingdoulyghucrzat
supabase db push
```

**Production** (when merging to `main`):

```bash
supabase link --project-ref qsccsddknmvidvcfpffu
supabase db push
```

Never edit migrations already applied to production — add new timestamped files only.

---

## Sanity check

1. Open Vercel preview URL for `development`
2. Change CMS content on `/cms`
3. Confirm **live production site** is unchanged

If production changes, Preview and Production share the same Supabase URL in Vercel — fix env scoping.
