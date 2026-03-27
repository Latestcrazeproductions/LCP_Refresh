import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

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
      googleFormUrl: 'https://forms.gle/fMkyGPgjFz6R59Wn9',
      available: true,
    },
    {
      id: 'pm-coordinator',
      title: 'Project Manager/Coordinator Request Form',
      description: 'Request PM or coordinator assignment for events.',
      googleFormUrl: 'https://forms.gle/ZL3nJekXySBuZa158',
      available: true,
    },
    {
      id: 'payables',
      title: 'LCP Payables Request Form - AP',
      description: 'Submit payment requests with supporting documentation.',
      googleFormUrl: 'https://forms.gle/vPLqsXJz2hBVKJSu7',
      available: true,
    },
    {
      id: 'attendance',
      title: 'Employee Attendance Infraction Log',
      description: 'Log tardy, call out, and no call/no show infractions.',
      googleFormUrl: 'https://forms.gle/oVFF9EAsTFDwYZTs7',
      available: true,
    },
  ] as const;

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
        <p className="text-gray-400 mb-4">
          Choose a form to get started. Google Forms are the default until the
          integrated forms are finished.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          Google Form links open in a new tab.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {forms.map((form) =>
            form.available ? (
              <div
                key={form.id}
                className="flex flex-col p-8 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/[0.07] transition-all"
              >
                <span className="text-4xl mb-4 block">📋</span>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {form.title}
                </h2>
                <p className="text-gray-400 text-sm flex-1">{form.description}</p>
                <a
                  href={form.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white hover:border-blue-400/50 hover:bg-white/[0.1] hover:text-blue-100 transition-all w-fit"
                >
                  <ExternalLink className="w-4 h-4 shrink-0 opacity-80" aria-hidden />
                  Open Google Form
                </a>
              </div>
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
