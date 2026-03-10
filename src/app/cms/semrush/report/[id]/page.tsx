import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SemrushReportViewer from './SemrushReportViewer';

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

  const { id } = await params;
  return <SemrushReportViewer reportId={id} />;
}
