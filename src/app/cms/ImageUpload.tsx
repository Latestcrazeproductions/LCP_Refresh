'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'site-assets';
const MAX_IMAGE_DIMENSION = 1920;
const IMAGE_QUALITY = 0.82;
const CACHE_CONTROL = '31536000';
const MAX_UPLOAD_SIZE = 3 * 1024 * 1024;

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

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', IMAGE_QUALITY);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

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
        const originalFile = files[i];
        const file = await compressImage(originalFile);
        if (file.size > MAX_UPLOAD_SIZE) {
          setError('Images must be 3 MB or less after compression.');
          return;
        }
        const ext = file.name.split('.').pop() || 'jpg';
        
        // Preserve original filename (sanitized) with timestamp for uniqueness
        const baseName = originalFile.name.replace(/\.[^.]+$/, '');
        const safe = baseName
          .replace(/[^a-zA-Z0-9-_]/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 80) || 'image';
        const name = `${folder}/${safe}-${Date.now()}.${ext}`;

        const { error: err } = await supabase.storage.from(BUCKET).upload(name, file, {
          cacheControl: CACHE_CONTROL,
          contentType: file.type,
          upsert: false,
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
      <p className="mt-1 text-[11px] text-gray-500">
        Images are resized to 1920px max and limited to 3 MB for lower storage and egress.
      </p>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
