import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CmsEditor from '../CmsEditor';

export default async function CmsEditorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  return (
    <div className="min-h-screen bg-nexus-black">
      <div className="border-b border-white/10 px-4 py-3 flex items-center gap-4">
        <a
          href="/cms"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Dashboard
        </a>
      </div>
      <CmsEditor />
    </div>
  );
}
