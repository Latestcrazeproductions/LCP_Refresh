'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  parseSettingsForSave,
  SITE_CONTENT_SITE_ID,
} from '@/lib/cms-app-settings';

const CMS_KEYS = [
  'brand',
  'hero',
  'about',
  'featuredVideo',
  'work',
  'services',
  'eventTypes',
  'contact',
  'faq',
  'settings',
] as const;
type CmsKey = (typeof CMS_KEYS)[number];

export async function saveContent(key: CmsKey, value: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  let payload: unknown = value;
  if (key === 'settings') {
    const parsed = parseSettingsForSave(value);
    if (!parsed.ok) {
      return { error: parsed.error };
    }
    payload = parsed.value;
  }

  const { error } = await supabase.from('site_content').upsert(
    {
      site_id: SITE_CONTENT_SITE_ID,
      key,
      value: payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'site_id,key' }
  );

  if (error) {
    return { error: error.message };
  }

  revalidateTag('site-content');
  revalidatePath('/');
  revalidatePath('/cms');
  return { success: true };
}
