import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SemrushSettings from './SemrushSettings';

export default async function SemrushSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  return <SemrushSettings />;
}
