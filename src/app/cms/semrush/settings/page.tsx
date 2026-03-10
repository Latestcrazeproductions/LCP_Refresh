import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SemrushComingSoon from '../ComingSoon';
import SemrushSettings from './SemrushSettings';

const SEMRUSH_ENABLED = process.env.NEXT_PUBLIC_SEMRUSH_ENABLED === 'true';

export default async function SemrushSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  if (!SEMRUSH_ENABLED) {
    return <SemrushComingSoon />;
  }

  return <SemrushSettings />;
}
