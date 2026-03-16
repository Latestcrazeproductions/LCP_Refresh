import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.eventName || !body.scope) {
      return NextResponse.json(
        { error: 'Event Name and Scope are required' },
        { status: 400 }
      );
    }

    const webAppUrl = process.env.GOOGLE_SHEETS_PM_COORDINATOR_URL;
    if (webAppUrl?.startsWith('https://')) {
      const res = await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error('Google Sheets PM Coordinator error:', res.status, await res.text());
        return NextResponse.json(
          { error: 'Failed to submit to sheet. Check GOOGLE_SHEETS_PM_COORDINATOR_URL.' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PM Coordinator API error:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
