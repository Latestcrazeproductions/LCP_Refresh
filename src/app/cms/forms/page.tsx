import { redirect } from 'next/navigation';

/**
 * Internal forms hub lives at /internal-forms (no auth) so staff can open
 * Google Forms before signing into the CMS. Keep this route as a redirect
 * for bookmarks and dashboard links that still pointed here.
 */
export default function CmsFormsRedirectPage() {
  redirect('/internal-forms');
}
