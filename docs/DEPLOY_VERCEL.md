# Deploy to Vercel

This guide walks through deploying the Nexus AV landing page to Vercel.

## Prerequisites

- GitHub repository connected
- Supabase project configured
- Resend account (for contact form emails)

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
| `RESEND_API_KEY` | Yes* | Resend API key for thank-you emails |
| `RESEND_FROM_EMAIL` | No | Sender email (default: `onboarding@resend.dev`) |
| `RESEND_FROM_NAME` | No | Sender name (default: from site content) |
| `NEXT_PUBLIC_SITE_URL` | Yes** | Production URL (e.g. `https://yourdomain.com`) |

\* Without `RESEND_API_KEY`, form submissions still save to Supabase but no email is sent.

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

### 6. Resend Setup (Production)

For production emails from your domain:

1. Verify your domain in [Resend Dashboard](https://resend.com/domains)
2. Set `RESEND_FROM_EMAIL` to e.g. `noreply@yourdomain.com`
3. Set `RESEND_FROM_NAME` to your company name

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

**Thank-you emails not sending**
- Add `RESEND_API_KEY`
- Verify sender domain in Resend if using custom email
