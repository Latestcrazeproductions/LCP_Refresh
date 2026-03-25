import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SettingsEditor from '@/components/SettingsEditor';
import {
  defaultCmsAppSettings,
  normalizeCmsAppSettings,
  SITE_CONTENT_SITE_ID,
} from '@/lib/cms-app-settings';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  const { data } = await supabase
    .from('site_content')
    .select('value')
    .eq('site_id', SITE_CONTENT_SITE_ID)
    .eq('key', 'settings')
    .maybeSingle();

  const initialSettings =
    data?.value != null
      ? normalizeCmsAppSettings(data.value)
      : defaultCmsAppSettings();

  return (
    <div className="min-h-screen bg-nexus-black">
      <div className="border-b border-white/10 px-4 py-3 flex items-center gap-4 max-w-4xl mx-auto w-full">
        <Link href="/cms" className="text-gray-400 hover:text-white text-sm transition-colors">
          ← Dashboard
        </Link>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Staff email notifications for the public contact form and visitor thank-you messages
          </p>
        </div>

        <SettingsEditor initialSettings={initialSettings} />
      </div>
    </div>
  );
}
