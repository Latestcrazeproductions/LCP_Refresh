import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function generateToken(length = 22) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    token += chars[array[i] % chars.length];
  }
  return token;
}

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
    const eventId = String(body.eventId || '').trim();
    const folder = String(body.folder || '').trim();

    if (!eventId || !folder) {
      return NextResponse.json(
        { error: 'eventId and folder are required to create upload link' },
        { status: 400 }
      );
    }

    const normalizedFolder = folder.replace(/[^a-zA-Z0-9-_\/]/g, '-').replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
    const token = generateToken(26);

    const { error } = await supabase.from('event_upload_links').insert({
      token,
      event_id: eventId,
      folder: `event-upload/${eventId}/${normalizedFolder}`,
    });

    if (error) {
      console.error('Error creating event upload link:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = host ? `${protocol}://${host}` : '';

    return NextResponse.json({
      token,
      eventId,
      folder: `event-upload/${eventId}/${normalizedFolder}`,
      link: `${baseUrl}/uploads/${token}`,
    });
  } catch (err) {
    console.error('Event upload link creation error:', err);
    return NextResponse.json({ error: 'Could not create upload link' }, { status: 500 });
  }
}
