import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

const BUCKET = 'site-assets';
const MAX_SIZE = 30 * 1024 * 1024; // 30 MB for event-sourced uploads
const CACHE_CONTROL = '31536000';

export async function POST(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const pathParts = pathname.split('/').filter(Boolean);
    const token = pathParts[pathParts.length - 2]; // /api/event-uploads/[token]/upload

    if (!token) {
      return NextResponse.json({ error: 'Invalid upload token' }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();
    const { data: linkRows, error: linkError } = await serviceSupabase
      .from('event_upload_links')
      .select('event_id, folder, active, expires_at')
      .eq('token', token)
      .single();

    if (linkError || !linkRows || !linkRows.active) {
      return NextResponse.json({ error: 'Upload link not found or disabled' }, { status: 404 });
    }

    if (linkRows.expires_at && new Date(linkRows.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Upload link expired' }, { status: 410 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File must be 30 MB or less' }, { status: 400 });
    }

    const originalName = file.name.replace(/[^a-zA-Z0-9-_.]/g, '-').slice(0, 120);
    const path = `${linkRows.folder}/${Date.now()}-${originalName}`;

    const { data: uploadData, error: uploadError } = await serviceSupabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: CACHE_CONTROL,
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error('Public event upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uploadData.path}`;

    return NextResponse.json({ url, path: uploadData.path, eventId: linkRows.event_id });
  } catch (err) {
    console.error('Public event upload exception:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
