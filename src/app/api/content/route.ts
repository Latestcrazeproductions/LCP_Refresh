import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { siteContent } from '@/content/site-content';
import { mergeContent } from '@/lib/content';
import type { SiteContent, SiteContentKey } from '@/lib/content';

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(siteContent);
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_content')
      .select('key, value');

    if (error || !data?.length) {
      return NextResponse.json(siteContent as SiteContent);
    }

    const fromDb = Object.fromEntries(
      data.map((row: { key: string; value: unknown }) => [row.key, row.value])
    ) as Partial<Record<SiteContentKey, unknown>>;

    return NextResponse.json(mergeContent(fromDb));
  } catch {
    return NextResponse.json(siteContent as SiteContent);
  }
}
