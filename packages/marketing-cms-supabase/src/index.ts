import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CMSConfig, mergeContent } from '@marketing-cms/core';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  siteId: string;
}

export async function fetchSiteContent(
  supabase: SupabaseClient,
  config: CMSConfig
): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from('site_content')
    .select('key, value')
    .eq('site_id', config.siteId);

  if (error || !data) {
    return config.defaults;
  }

  const fromDb = Object.fromEntries(
    data.map((row: { key: string; value: any }) => [row.key, row.value])
  );

  return mergeContent(fromDb, config);
}

export async function saveSiteContent(
  supabase: SupabaseClient,
  siteId: string,
  key: string,
  value: any
) {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      { site_id: siteId, key, value, updated_at: new Date().toISOString() },
      { onConflict: 'site_id,key' }
    );

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
