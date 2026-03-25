import { createServiceRoleClient } from '@/lib/supabase/server';
import {
  defaultCmsAppSettings,
  normalizeCmsAppSettings,
  SITE_CONTENT_SITE_ID,
  type CmsAppSettings,
} from '@/lib/cms-app-settings';

/** Load settings with service role so the public contact API can read staff emails (row is hidden from anon). */
export async function fetchCmsAppSettingsForContactApi(): Promise<CmsAppSettings> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('site_id', SITE_CONTENT_SITE_ID)
      .eq('key', 'settings')
      .maybeSingle();
    if (error || data?.value == null) return defaultCmsAppSettings();
    return normalizeCmsAppSettings(data.value);
  } catch {
    return defaultCmsAppSettings();
  }
}
