import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PmCoordinatorForm from './PmCoordinatorForm';

export default async function PmCoordinatorFormPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  return (
    <div className="min-h-screen bg-nexus-black">
      <PmCoordinatorForm />
    </div>
  );
}
