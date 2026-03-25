# Latest Craze Productions

Marketing and events website for Latest Craze Productions, built with Next.js 15.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (content, forms, storage)
- **Email:** Resend (contact form thank-you emails)

## Local Setup

1. Clone and install:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Fill in `.env` with your Supabase and Resend credentials (see [docs](docs/) for details).

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run sync-contacts` | Sync LASSO contacts (see `docs/LASSO_CONTACTS_CRON.md`) |

## Docs

- [Deploy to Vercel](docs/DEPLOY_VERCEL.md)
- [CMS Setup](docs/CMS_SETUP.md)
- [Forms & Google Sheets](docs/FORMS_GOOGLE_SHEETS.md)
- [LASSO Contacts](docs/LASSO_CONTACTS_CRON.md)

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `main` trigger production deployments. For dev/testing, deploy to a preview branch first.

See [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md) for environment variables and setup.
