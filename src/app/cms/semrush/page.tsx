import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SemrushDashboard from './SemrushDashboard';

export default async function SemrushPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  return <SemrushDashboard />;
}
