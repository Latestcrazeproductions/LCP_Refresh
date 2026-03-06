'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'site-assets';

function getPublicUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return path;
  const base = url.replace('.supabase.co', '');
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}

type ImageUploadProps = {
  folder: string;
  accept?: string;
  label?: string;
} & (
  | { mode?: 'single'; onUpload: (url: string) => void }
  | { mode: 'bulk'; onUpload: (urls: string[]) => void }
);

export function ImageUpload({ folder, mode = 'single', accept = 'image/*', onUpload, label = 'Upload' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setError(null);
    setUploading(true);

    const supabase = createClient();
    const urls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop() || 'jpg';
        const name = `${folder}/${Date.now()}-${i}.${ext}`;

        const { error: err } = await supabase.storage.from(BUCKET).upload(name, file, {
          contentType: file.type,
        });

        if (err) {
          setError(err.message);
          return;
        }

        urls.push(getPublicUrl(name));
      }

      if (mode === 'single') {
        (onUpload as (url: string) => void)(urls[0]);
      } else {
        (onUpload as (urls: string[]) => void)(urls);
      }
    } finally {
      setUploading(false);
      e.target.value = '';
      inputRef.current?.form?.reset();
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={mode === 'bulk'}
        onChange={handleChange}
        disabled={uploading}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-sm text-white disabled:opacity-50 transition-colors"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? 'Uploading...' : `${label} (${mode === 'bulk' ? 'multiple' : 'single'})`}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
