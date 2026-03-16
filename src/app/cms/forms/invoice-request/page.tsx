import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import InvoiceRequestForm from './InvoiceRequestForm';

export default async function InvoiceRequestFormPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  return (
    <div className="min-h-screen bg-nexus-black">
      <InvoiceRequestForm />
    </div>
  );
}
