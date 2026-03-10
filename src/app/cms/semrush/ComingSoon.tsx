'use client';

import Link from 'next/link';

export default function SemrushComingSoon() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">📊</div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">
          SemRush Reports
        </h1>
        <p className="text-2xl font-semibold text-blue-400 mb-4">Coming Soon</p>
        <p className="text-gray-400 text-sm mb-8">
          Domain analytics, keywords, backlinks, and SEO reports will be available here after launch.
        </p>
        <Link
          href="/cms"
          className="inline-block px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
