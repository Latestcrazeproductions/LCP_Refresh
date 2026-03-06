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
