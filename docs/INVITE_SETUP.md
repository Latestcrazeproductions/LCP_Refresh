# User Invite & Password Setup

When you invite a user via Supabase, they receive an email. That email link should redirect them to a **password setup page**, and after setting a password they are sent to the **login page**.

## Flow

1. Admin invites user (Supabase Dashboard → Authentication → Users → Invite user)
2. User receives invite email and clicks the link
3. User lands on `/auth/callback`, which establishes a session
4. User is redirected to `/cms/set-password`
5. User sets a password
6. User is redirected to `/cms/login` to sign in with their new password

## Supabase Dashboard Configuration

### 1. Site URL & Redirect URLs

In your Supabase project:

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to your production URL, e.g.:
   - `https://your-domain.vercel.app` (Vercel)
   - `https://yourdomain.com` (custom domain)
3. Add **Redirect URLs** (one per line):
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/cms/set-password`
   - `https://your-domain.vercel.app/cms/login`
   - For local dev: `http://localhost:3000/auth/callback`

Supabase allows wildcards: `https://*.vercel.app/auth/callback` if you use preview deployments.

### 2. Invite User

When inviting a user from **Authentication → Users → Invite user**:

- The **Redirect To** option (if shown) should point to your auth callback.
- If using the Supabase dashboard “Invite user” form, it uses the **Site URL** and appends the verify path. Ensure Site URL is correct so the link goes to your app.

Supabase’s default invite email uses `{{ .ConfirmationURL }}`, which verifies the token and then redirects to your Site URL. To land on your auth callback instead, customize the invite template (see below).

### 3. Custom Invite Email Template (Optional)

To have the invite link go directly to your auth callback:

1. Go to **Authentication → Email Templates**
2. Select **Invite user**
3. In the template, the link uses `{{ .ConfirmationURL }}`. The default ConfirmationURL already includes a `redirect_to` when you pass it via the API.

When using `inviteUserByEmail()` from code, pass:

```ts
const { data, error } = await supabase.auth.admin.inviteUserByEmail(
  'user@example.com',
  {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  }
);
```

The email’s `{{ .ConfirmationURL }}` will then redirect to your auth callback after verification.

If you invite only from the Supabase Dashboard, set **Site URL** to your app root (e.g. `https://yoursite.com`) and add a redirect rule if needed. The built-in invite flow uses Site URL as the base.

### 4. Pages in This App

| Path | Purpose |
|------|---------|
| `/auth/callback` | Handles the invite/magic link redirect; exchanges token for session; redirects invite users to set-password |
| `/cms/set-password` | Form for invited users to set their password; redirects to login after success |
| `/cms/login` | Standard login page |

## Inviting from Code (Admin API)

If you have server-side access with the service role key:

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin only
);

const { data, error } = await supabase.auth.admin.inviteUserByEmail(
  'newuser@example.com',
  {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    data: { full_name: 'Jane Doe' }, // Optional metadata
  }
);
```

Ensure `NEXT_PUBLIC_SITE_URL` is set (e.g. in Vercel env vars) so the redirect URL is correct.
