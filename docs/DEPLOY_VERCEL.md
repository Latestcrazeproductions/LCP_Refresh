# Deploy to Vercel

This guide walks through deploying the Latest Craze Productions landing page to Vercel.

## Prerequisites

- GitHub repository connected
- Supabase project configured
- Outbound SMTP (e.g. **DreamHost** mailbox for your domain, or Google Workspace), *or* legacy Resend

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub recommended)
2. Click **Add New → Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js — no framework override needed

### 2. Configure Environment Variables

In your Vercel project **Settings → Environment Variables**, add:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (e.g. `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SMTP_USER` | Yes* | Full sender address (e.g. `noreply@yourdomain.com`) |
| `SMTP_PASS` | Yes* | Mailbox or app password (never commit) |
| `SMTP_HOST` | No | e.g. `smtp.dreamhost.com` (DreamHost) or `smtp.gmail.com` (Google); default `smtp.gmail.com` |
| `SMTP_PORT` | No | Default `465` (SSL). Use `587` for STARTTLS (DreamHost/Google both support it) |
| `MAIL_FROM_EMAIL` | No | From address (defaults to `SMTP_USER`) |
| `MAIL_FROM_NAME` | No | From display name (defaults to site brand from CMS) |
| `RESEND_API_KEY` | Legacy | Used only if `SMTP_USER` / `SMTP_PASS` are unset |
| `RESEND_FROM_EMAIL` | Legacy | With Resend fallback |
| `RESEND_FROM_NAME` | Legacy | With Resend fallback |
| `NEXT_PUBLIC_SITE_URL` | Yes** | Production URL (e.g. `https://yourdomain.com`) |
| `NEXT_PUBLIC_SEMRUSH_API_URL` | No | Semrush proxy API URL (default: localhost; set for CMS reports) |
| `NEXT_PUBLIC_SEMRUSH_ENABLED` | No | Set to `true` to enable Semrush Reports in CMS |
| `GOOGLE_SHEETS_*_URL` | No | Apps Script web app URLs for forms (see `docs/FORMS_GOOGLE_SHEETS.md`) |

\* Without SMTP or Resend, form submissions still save to Supabase but no email is sent.

\** Required for correct sitemap, robots, Open Graph, and thank-you emails. Use your Vercel URL (e.g. `https://your-project.vercel.app`) or custom domain.

**Production:** Add variables for **Production** environment. Optionally add for Preview to test PRs.

### 3. Deploy

1. Click **Deploy**
2. Vercel runs `npm install` and `npm run build`
3. The site is live at `https://your-project.vercel.app`

### 4. Custom Domain (Optional)

1. **Settings → Domains**
2. Add your domain and follow DNS instructions
3. Set `NEXT_PUBLIC_SITE_URL` to your custom domain
4. Redeploy to pick up the new URL

### 5. Supabase Setup

Ensure your Supabase project has:

- `site_content` table (run migration `20250306000000_create_site_content.sql`)
- `contact_submissions` table (run migration `20250306100000_create_contact_submissions.sql`)
- `site-assets` storage bucket for CMS uploads
- At least one user in **Authentication → Users** for CMS access

### 6. Contact email (Production)

**DreamHost (domain registered / email hosted at DreamHost):**

1. In the [DreamHost panel](https://panel.dreamhost.com), create a mailbox for your domain (e.g. `noreply@yourdomain.com`) under **Mail → Manage Email**.
2. In Vercel, set:
   - `SMTP_HOST` = `smtp.dreamhost.com`
   - `SMTP_PORT` = `465` (SSL) or `587` (TLS / STARTTLS)
   - `SMTP_USER` = the **full email address** of that mailbox
   - `SMTP_PASS` = that mailbox’s password
   - `MAIL_FROM_EMAIL` = same address (or another address only if DreamHost allows it as send-as)
   - `MAIL_FROM_NAME` = display name (optional; defaults to site brand from CMS)
3. Official client/SMTP overview: [DreamHost — Email client configuration](https://help.dreamhost.com/hc/en-us/articles/214918038-Email-client-configuration-overview).

The app only **connects out** to your SMTP server (from Vercel). Your domain’s DNS can stay on DreamHost; you do **not** need to move DNS to send mail this way.

**Google Workspace / Gmail:**

1. Create or pick a sender mailbox (e.g. `noreply@yourdomain.com`).
2. Use an [App Password](https://support.google.com/accounts/answer/185833) or your admin’s SMTP relay policy.
3. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_USER`, `SMTP_PASS`, and optional `MAIL_FROM_*`, `SMTP_PORT` (465 or 587).

**Legacy Resend:** If `SMTP_USER` and `SMTP_PASS` are unset, set `RESEND_API_KEY` and optional `RESEND_FROM_*` as before.

## Deploy via Vercel CLI

For quick deploys from the terminal:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# First time: link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Before first deploy, add env vars via **Vercel Dashboard → Settings → Environment Variables**, or use `vercel env pull` after linking to pull from an existing project.

## Vercel MCP (Optional)

If you use Cursor or another MCP client to deploy or manage this project:

```bash
# Link project first (if not already)
vercel link

# Set up project-specific MCP access
vercel mcp --project
```

This configures your local MCP client to talk to this Vercel project for deployments and project management.

## Build Settings (Default)

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** (auto)
- **Install Command:** `npm install`
- **Node.js Version:** 18.x or 20.x (Vercel default)

## Troubleshooting

**Build fails**
- Ensure all required env vars are set
- Check build logs for missing `NEXT_PUBLIC_*` variables

**CMS or form not working**
- Verify Supabase URL and anon key
- Check Supabase RLS policies allow public read for `site_content` and insert for `contact_submissions`

**Thank-you / staff emails not sending**
- Set `SMTP_USER` + `SMTP_PASS` (DreamHost mailbox, Workspace, etc.) or `RESEND_API_KEY` (legacy)
- DreamHost: use `smtp.dreamhost.com`, full email as `SMTP_USER`, correct port (465 vs 587)
- Google: confirm app password and that `MAIL_FROM_EMAIL` matches an allowed sender
