'use client';

import { useState } from 'react';

type EventUploadsClientProps = { eventTypes: Array<{ id: string; title: string }> };

type CreateUploadLinkResult = {
  token?: string;
  folder?: string;
  link?: string;
  error?: string;
};

async function createUploadLink(eventId: string, folder: string): Promise<CreateUploadLinkResult> {
  const res = await fetch('/api/event-uploads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventId, folder }),
  });
  return res.json();
}

export default function EventUploadsClient({ eventTypes }: EventUploadsClientProps) {
  const [eventId, setEventId] = useState(eventTypes[0]?.id || '');
  const [folder, setFolder] = useState('client-assets');
  const [result, setResult] = useState<CreateUploadLinkResult | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    setLoading(true);
    const data = await createUploadLink(eventId, folder);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Event Upload Link</h1>
      <form className="space-y-4 max-w-lg" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Event</span>
          <select
            className="mt-1 block w-full rounded-lg border"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            {eventTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Folder suffix</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-lg border"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading || !eventId} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Link'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 border rounded bg-white text-slate-800">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <p className="font-bold">Upload link generated</p>
              <p>
                URL:{' '}
                <a href={result.link} target="_blank" rel="noreferrer" className="underline">
                  {result.link}
                </a>
              </p>
              <p>Folder: {result.folder}</p>
              <p>Token: {result.token}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
