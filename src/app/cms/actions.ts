'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const CMS_KEYS = ['brand', 'hero', 'featuredVideo', 'work', 'services', 'eventTypes', 'faq', 'contact'] as const;
type CmsKey = (typeof CMS_KEYS)[number];

export async function saveContent(key: CmsKey, value: unknown) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('site_content')
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

  if (error) {
    return { error: error.message };
  }

  revalidateTag('site-content');
  revalidatePath('/');
  revalidatePath('/cms');
  return { success: true };
}
