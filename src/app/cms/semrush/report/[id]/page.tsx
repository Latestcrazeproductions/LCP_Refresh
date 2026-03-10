import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SemrushComingSoon from '../../ComingSoon';
import SemrushReportViewer from './SemrushReportViewer';

const SEMRUSH_ENABLED = process.env.NEXT_PUBLIC_SEMRUSH_ENABLED === 'true';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SemrushReportPage({ params }: Props) {
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

  const { id } = await params;
  return <SemrushReportViewer reportId={id} />;
}
