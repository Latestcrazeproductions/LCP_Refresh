'use client';

import { useState } from 'react';

type EventUploadLandingProps = {
  token: string;
  eventId: string;
  folder: string;
};

export default function EventUploadLanding({ token, eventId, folder }: EventUploadLandingProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatus('Please choose a file first');
      return;
    }

    setUploading(true);
    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/event-uploads/${token}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || 'Upload failed');
        setUploadedUrl(null);
      } else {
        setStatus('Upload successful');
        setUploadedUrl(data.url);
      }
    } catch (err) {
      setStatus('Upload request failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Upload files for event: {eventId}</h1>
      <p className="text-sm text-gray-500 mb-4">Folder: {folder}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={uploading}
          className="block w-full"
        />
        <button
          type="submit"
          disabled={uploading || !file}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {status && <p className="mt-3 text-sm">{status}</p>}
      {uploadedUrl && (
        <p className="mt-1 text-sm text-green-700">
          Uploaded: <a href={uploadedUrl} target="_blank" rel="noreferrer" className="underline">{uploadedUrl}</a>
        </p>
      )}
    </div>
  );
}
