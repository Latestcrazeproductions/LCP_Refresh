import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CmsEditor from './CmsEditor';

export default async function CmsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  return (
    <div className="min-h-screen bg-nexus-black">
      <CmsEditor />
    </div>
  );
}
