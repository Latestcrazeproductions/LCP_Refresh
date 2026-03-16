import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BUCKET = 'site-assets';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const CACHE_CONTROL = '31536000';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'forms';

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File must be 10 MB or less' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'bin';
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60);
    const path = `${folder}/${baseName}-${Date.now()}.${ext}`;

    const { data: uploadData, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: CACHE_CONTROL,
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uploadData.path}`;

    return NextResponse.json({ url, path: uploadData.path });
  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
