# CMS Setup

The CMS is available at `/cms` and is protected by Supabase Auth.

## Prerequisites

1. A [Supabase](https://supabase.com) project
2. Environment variables configured

## Setup Steps

### 1. Create a Supabase Project

Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from your project's **Settings → API**.

### 3. Run the Migration

Apply the `site_content` table migration. You can either:

**Option A: Supabase CLI**

```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

**Option B: SQL Editor**

Run the contents of `supabase/migrations/20250306000000_create_site_content.sql` in your project's SQL Editor.

### 4. Create a User

Create a user to sign in to the CMS:

1. Go to **Authentication → Users** in the Supabase dashboard
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Or enable **Email** auth and use **Sign up** on the login page (you’d need to add a sign-up flow)

For now, create the user manually in the dashboard.

### 5. Access the CMS

1. Run `npm run dev`
2. Go to [http://localhost:3000/cms](http://localhost:3000/cms)
3. Sign in with your user credentials

## Image & Logo Uploads

The CMS uses Supabase Storage (bucket: `site-assets`) for uploads. The bucket and policies are already configured. Use the upload buttons in each section:

- **Brand** — Single upload for logo and logo dark
- **Hero** — Bulk upload for slideshow images
- **Work — Client logos** — Bulk upload; each file becomes a logo in the marquee
- **Work — Project images** — Bulk upload; order matches project order
- **Services** — Bulk upload; order: LED Walls, Lighting, Stage, Audio

Uploaded files are stored in Supabase and URLs are auto-inserted into the content. Click **Save** after uploading to publish.

## CMS Sections

The CMS mirrors the structure in `public/CONTENT_GUIDE.md`:

- **Brand** — Company name, logo paths
- **Hero** — Eyebrow, headline, subhead, image URLs
- **Work** — Clients marquee, projects, titles
- **Services** — Section copy, service items (JSON)
- **Contact** — Headline, subhead, email, phone, address, footer links

Edits are stored in Supabase. The public site reads from Supabase when configured; otherwise it falls back to `src/content/site-content.ts`.

## Contact Form & Thank-You Emails

The contact form saves submissions to Supabase (`contact_submissions` table) and sends a thank-you email via [Resend](https://resend.com) (Supabase's recommended email partner). The email uses your site's logo, hero image, and service images from the CMS.

### Setup

1. **Run the contact_submissions migration**

   Apply `supabase/migrations/20250306100000_create_contact_submissions.sql` via CLI or SQL Editor.

2. **Configure Resend**

   - Create an account at [resend.com](https://resend.com)
   - Add to `.env.local`:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxx
     RESEND_FROM_EMAIL=onboarding@resend.dev
     RESEND_FROM_NAME=Nexus AV Productions
     ```
   - For production, verify your domain in Resend and use e.g. `noreply@yourdomain.com`

3. **Form behavior**

   Submissions are always saved to Supabase. If `RESEND_API_KEY` is missing, no email is sent but the form still succeeds.
