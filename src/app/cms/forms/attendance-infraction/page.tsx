import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AttendanceInfractionForm from './AttendanceInfractionForm';

export default async function AttendanceInfractionFormPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  return (
    <div className="min-h-screen bg-nexus-black">
      <AttendanceInfractionForm />
    </div>
  );
}
