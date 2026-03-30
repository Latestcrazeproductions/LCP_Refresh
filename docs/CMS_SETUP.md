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

Apply the `site_content` table migrations. You can either:

**Option A: Supabase CLI**

```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

**Option B: SQL Editor**

1. Run `supabase/migrations/20250306000000_create_site_content.sql`
2. Run `supabase/migrations/20250307000000_add_event_types_key.sql` (adds `eventTypes` to allowed keys)

**If you get `site_content_key_check` violation when saving Event Types**, run the contents of `supabase/migrations/20250307000000_add_event_types_key.sql` in the SQL Editor. Or run this (finds and drops the constraint regardless of name):

```sql
do $$
declare r record;
begin
  for r in
    select c.conname from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on t.relnamespace = n.oid
    where n.nspname = 'public' and t.relname = 'site_content'
      and c.contype = 'c' and pg_get_constraintdef(c.oid) like '%(key)%'
  loop
    execute format('alter table public.site_content drop constraint %I', r.conname);
  end loop;
end $$;
alter table public.site_content add constraint site_content_key_check
  check (key in ('brand', 'hero', 'work', 'services', 'eventTypes', 'contact'));
```

### 4. Create a User

Create a user to sign in to the CMS:

1. Go to **Authentication → Users** in the Supabase dashboard
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Or enable **Email** auth and use **Sign up** on the login page (you’d need to add a sign-up flow)

For now, create the user manually in the dashboard. To invite users by email with a password setup flow and redirect to the login page, see [INVITE_SETUP.md](./INVITE_SETUP.md).

### 5. Access the CMS

1. Run `npm run dev`
2. Go to [http://localhost:3000/cms](http://localhost:3000/cms)
3. Sign in with your user credentials

## Image & Logo Uploads

The CMS uses Supabase Storage (bucket: `site-assets`) for uploads. **You must create this bucket first.**

### Create the site-assets bucket

1. In the Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `site-assets`
4. Enable **Public bucket** (so uploaded images can be displayed on the site)
5. Click **Create bucket**
6. After creation, click the bucket → **Policies** → **New policy**
7. For uploads, add a policy that allows authenticated users to insert:
   - Policy name: `Authenticated users can upload`
   - Allowed operation: **INSERT**
   - Target roles: `authenticated`
   - With check expression: `true` (or `bucket_id = 'site-assets'`)
8. Add a policy for public read access (or rely on the bucket being public):
   - Policy name: `Public read`
   - Allowed operation: **SELECT**
   - Target roles: `public` (or leave empty for anonymous)
   - With check: `true`

**Quick policy via SQL (optional):** In the SQL Editor, run:

```sql
-- Create the bucket via Storage API isn't possible in SQL; use Dashboard.
-- After creating bucket manually, add policies:
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

-- Allow authenticated uploads
create policy "Authenticated upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-assets');

create policy "Public read" on storage.objects
  for select to public using (bucket_id = 'site-assets');
```

If the bucket already exists, the first `insert` will no-op and the policies will be created.

### Using the upload buttons

Use the upload buttons in each section:

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

The contact form saves submissions to Supabase (`contact_submissions` table) and sends staff notifications and optional thank-you email via **Google Workspace SMTP** (Nodemailer), or legacy **Resend** if SMTP is not configured. The thank-you email uses your site's logo, hero image, and service images from the CMS.

### Setup

1. **Run the contact_submissions migration**

   Apply `supabase/migrations/20250306100000_create_contact_submissions.sql` via CLI or SQL Editor.

2. **Configure outbound email (Google Workspace)**

   - Use a Workspace mailbox and an [App Password](https://support.google.com/accounts/answer/185833) (or your admin’s SMTP relay).
   - Add to `.env.local`, for example:
     ```
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=465
     SMTP_USER=noreply@yourdomain.com
     SMTP_PASS=your-app-password
     MAIL_FROM_EMAIL=noreply@yourdomain.com
     MAIL_FROM_NAME=Latest Craze Productions
     ```
   - Port **587** with STARTTLS is supported if `SMTP_PORT=587`.

   **Legacy Resend:** If `SMTP_USER` and `SMTP_PASS` are unset, set `RESEND_API_KEY` and optional `RESEND_FROM_*` instead.

3. **Form behavior**

   Submissions are always saved to Supabase. If neither SMTP nor Resend is configured, no email is sent but the form still succeeds.
