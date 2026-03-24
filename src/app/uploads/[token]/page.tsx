import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EventUploadLanding from '@/components/EventUploadLanding';

type Props = { params: Promise<{ token: string }> };

export default async function UploadPage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('event_upload_links')
    .select('event_id, folder, active, expires_at')
    .eq('token', token)
    .single();

  if (error || !data || !data.active) {
    return notFound();
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <EventUploadLanding token={token} eventId={data.event_id} folder={data.folder} />
      </div>
    </div>
  );
}
