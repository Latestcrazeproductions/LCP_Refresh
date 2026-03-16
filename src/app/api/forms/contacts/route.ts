import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export type ContactResult = { id: string; name: string; email: string; company?: string };

/**
 * Search contacts for the Invoice Request form.
 * Sources: Supabase invoice_contacts table.
 * Optional: Can be extended to call LASSO API when LASSO_API_URL + LASSO_API_KEY are configured.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    if (q.length < 2) {
      return NextResponse.json({ contacts: [] });
    }

    // Sanitize: escape LIKE wildcards and restrict to safe chars
    const safeQ = q.replace(/[%_\\]/g, ' ').slice(0, 100);

    // Search Supabase invoice_contacts (name and email)
    const { data, error } = await supabase
      .from('invoice_contacts')
      .select('id, name, email, company')
      .or(`name.ilike.%${safeQ}%,email.ilike.%${safeQ}%`)
      .order('name', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Contacts search error:', error);
      return NextResponse.json(
        { error: 'Failed to search contacts' },
        { status: 500 }
      );
    }

    const results: ContactResult[] = (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      company: row.company ?? undefined,
    }));

    return NextResponse.json({ contacts: results });
  } catch (err) {
    console.error('Contacts API error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
