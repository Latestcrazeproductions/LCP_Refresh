import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function InternalFormsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  const forms = [
    {
      id: 'invoice-request',
      title: 'Invoice Request Form',
      description: 'Submit invoice requests for events. Data populates the AR Form_Responses sheet.',
      href: '/cms/forms/invoice-request',
      available: true,
    },
    {
      id: 'pm-coordinator',
      title: 'Project Manager/Coordinator Request Form',
      description: 'Request PM or coordinator assignment for events.',
      href: '/cms/forms/pm-coordinator',
      available: true,
    },
    {
      id: 'payables',
      title: 'LCP Payables Request Form - AP',
      description: 'Submit payment requests with supporting documentation.',
      href: '/cms/forms/payables',
      available: true,
    },
    {
      id: 'attendance',
      title: 'Employee Attendance Infraction Log',
      description: 'Log tardy, call out, and no call/no show infractions.',
      href: '/cms/forms/attendance-infraction',
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-nexus-black px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link
            href="/cms"
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Internal Forms
        </h1>
        <p className="text-gray-400 mb-10">
          Choose a form to get started
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {forms.map((form) =>
            form.available ? (
              <Link
                key={form.id}
                href={form.href}
                className="block p-8 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/[0.07] transition-all group"
              >
                <span className="text-4xl mb-4 block">📋</span>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {form.title}
                </h2>
                <p className="text-gray-400 text-sm">{form.description}</p>
                <span className="inline-block mt-4 text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Open →
                </span>
              </Link>
            ) : (
              <div
                key={form.id}
                className="block p-8 bg-white/5 border border-white/5 rounded-xl opacity-60 cursor-not-allowed"
              >
                <span className="text-4xl mb-4 block">📋</span>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {form.title}
                </h2>
                <p className="text-gray-400 text-sm">{form.description}</p>
                <span className="inline-block mt-4 text-gray-500 text-sm">
                  Coming soon
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
