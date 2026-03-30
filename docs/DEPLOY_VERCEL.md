# Deploy to Vercel

This guide walks through deploying the Latest Craze Productions landing page to Vercel.

## Prerequisites

- GitHub repository connected
- Supabase project configured
- Google Workspace mailbox (App Password or SMTP relay) for contact form email, *or* legacy Resend

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
| `SMTP_USER` | Yes* | Workspace mailbox (e.g. `noreply@yourdomain.com`) |
| `SMTP_PASS` | Yes* | App password or SMTP secret (never commit) |
| `SMTP_HOST` | No | Default `smtp.gmail.com` |
| `SMTP_PORT` | No | Default `465` (use `587` with STARTTLS if your relay requires it) |
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

**Google Workspace (recommended):**

1. Create or pick a sender mailbox (e.g. `noreply@yourdomain.com`).
2. Enable 2-Step Verification and create an [App Password](https://support.google.com/accounts/answer/185833), or use an SMTP relay your admin configures.
3. In Vercel, set `SMTP_USER`, `SMTP_PASS`, and optionally `MAIL_FROM_EMAIL`, `MAIL_FROM_NAME`, `SMTP_PORT` (465 or 587).
4. Ensure SPF/DKIM are correct in Google Admin for your domain.

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
- Set `SMTP_USER` + `SMTP_PASS` (Workspace) or `RESEND_API_KEY` (legacy)
- For Workspace: confirm app password, port (465 vs 587), and that `MAIL_FROM_EMAIL` matches an allowed sender
