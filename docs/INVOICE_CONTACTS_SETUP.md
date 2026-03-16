# Invoice Contacts (LASSO Sync)

The Invoice Request Form uses a searchable contact dropdown. Contacts are stored in Supabase (`invoice_contacts` table) and can be synced from LASSO.

## Database table

The `invoice_contacts` table has:

| Column  | Type    | Notes                         |
|---------|---------|-------------------------------|
| id      | uuid    | Auto-generated                |
| name    | text    | Full name (required)         |
| email   | text    | Email (required)             |
| company | text    | Optional                      |
| created_at | timestamptz | Auto-set on insert     |

## Populating contacts

### Option 1: Supabase Dashboard

1. Go to your Supabase project → Table Editor
2. Open the `invoice_contacts` table
3. Insert rows manually or use **Import data from CSV**

### Option 2: SQL insert

```sql
INSERT INTO invoice_contacts (name, email, company)
VALUES
  ('Jenna Summer', 'jenna.sujeby@events.io', 'Events.io'),
  ('Maria Posty', 'maria.posty@avaya.com', 'Avaya');
```

### Option 3: LASSO export → CSV import

1. Export your contacts from LASSO (CSV or Excel)
2. Ensure columns include **name** and **email**
3. In Supabase: Table Editor → `invoice_contacts` → **Import data from CSV**
4. Map your LASSO columns to `name`, `email`, `company` as needed

### Option 4: LASSO API (future)

If LASSO provides an API for contacts, you can:

1. Add `LASSO_API_URL` and `LASSO_API_KEY` to `.env`
2. Extend `/api/forms/contacts` to fetch from LASSO and merge with Supabase results
3. Or run a scheduled sync job that pulls from LASSO and upserts into `invoice_contacts`

For LASSO API access, contact LASSO support or check their developer documentation.

## Using the form

On the Invoice Request Form:

1. Click **Name of Person(s) to Send Invoice To**
2. Type the first 2+ letters of the name (e.g. `jen`)
3. Select a contact from the dropdown
4. The **Email** field auto-fills from the selected contact
5. You can still edit the email manually if needed
