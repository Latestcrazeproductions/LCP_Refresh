# LASSO Contacts Sync – Nightly Cron

The `sync-contacts` script pulls contacts from LASSO and upserts them into Supabase `invoice_contacts`. Run it nightly via cron so the Invoice Request form always shows up-to-date contacts.

## Prerequisites

1. **LASSO API access** – API key and base URL from your LASSO subscription
2. **Supabase service role key** – For server-side writes (bypasses RLS)
3. **Migration** – Run `20250312000001_add_invoice_contacts_unique_email.sql` if you have existing `invoice_contacts` (adds unique constraint on email). Remove duplicate emails first if any exist.

## Env vars

Add to `.env` (or `.env.local`). Do **not** commit the service role key.

```env
# LASSO API (from your LASSO account/support)
LASSO_API_URL=https://api.lasso.io
LASSO_API_KEY=your-lasso-api-key

# Endpoint that returns contacts. Common patterns:
# - /v1/contacts
# - /api/contacts
# - /people
# Leave empty to try the default path
LASSO_CONTACTS_ENDPOINT=/v1/contacts

# Supabase (use service role for sync – bypasses RLS)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get the service role key: Supabase Dashboard → Project Settings → API → `service_role` (secret).

## Test run

```bash
npm run sync-contacts
```

Check output for success/errors. Inspect `invoice_contacts` in the Supabase Table Editor.

## Cron setup

### macOS / Linux (crontab)

```bash
crontab -e
```

Add:

```
0 2 * * * cd /path/to/LCP_Refresh && /usr/local/bin/node scripts/sync-lasso-contacts.mjs >> /var/log/lasso-sync.log 2>&1
```

Runs daily at 2:00 AM. Adjust `cd` path and `node` path as needed.

### Vercel Cron (if hosting there)

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/sync-contacts",
    "schedule": "0 2 * * *"
  }]
}
```

Then create an API route that runs the sync (and verifies the cron secret). Vercel crons hit a URL; the route would exec the sync logic.

### Other hosts

- **Railway / Render** – use their cron/scheduled job feature
- **GitHub Actions** – scheduled workflow that runs `npm run sync-contacts` (needs a runner with env vars)
- **External cron service** – call an HTTP endpoint that triggers the sync (with auth)

## LASSO response format

The script expects the LASSO endpoint to return JSON like:

```json
[
  { "name": "Jenna Summer", "email": "jenna@example.com", "company": "Acme Inc" },
  { "name": "Maria Posty", "email": "maria@example.com" }
]
```

If your LASSO API uses different field names, edit `scripts/sync-lasso-contacts.mjs` and update the field mapping in `fetchLassoContacts` (the `.map((r) => ({ name: ..., email: ..., company: ... }))` block).
