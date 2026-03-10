import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function CmsDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/cms/login');
  }

  return (
    <div className="min-h-screen bg-nexus-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">
          Dashboard
        </h1>
        <p className="text-gray-400 text-center mb-10">
          Choose a tool to get started
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/cms/editor"
            className="block p-8 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/[0.07] transition-all group"
          >
            <span className="text-4xl mb-4 block">📝</span>
            <h2 className="text-xl font-semibold text-white mb-2">CMS Editor</h2>
            <p className="text-gray-400 text-sm">
              Edit site content, hero images, services, and more
            </p>
            <span className="inline-block mt-4 text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Open →
            </span>
          </Link>

          <Link
            href="/cms/semrush"
            className="block p-8 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/[0.07] transition-all group"
          >
            <span className="text-4xl mb-4 block">📊</span>
            <h2 className="text-xl font-semibold text-white mb-2">SemRush Reports</h2>
            <p className="text-gray-400 text-sm">
              View domain analytics, keywords, backlinks, and SEO reports
            </p>
            <span className="inline-block mt-4 text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Open →
            </span>
          </Link>
        </div>

        <p className="mt-10 text-center">
          <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
