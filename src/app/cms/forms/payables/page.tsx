import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PayablesForm from './PayablesForm';

export default async function PayablesFormPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  return (
    <div className="min-h-screen bg-nexus-black">
      <PayablesForm />
    </div>
  );
}
