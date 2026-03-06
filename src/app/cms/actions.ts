'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { SiteContentKey } from '@/lib/content';

export async function saveContent(key: SiteContentKey, value: unknown) {
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

  revalidatePath('/');
  revalidatePath('/cms');
  return { success: true };
}
