import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface SeoContentShellProps {
  children: ReactNode;
}

/** Light, inviting shell for demand-engine / SEO marketing pages. */
export function SeoContentShell({ children }: SeoContentShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-stone-50 text-slate-900 selection:bg-blue-200/60">
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-amber-100/50 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-24 h-[360px] w-[360px] rounded-full bg-blue-100/60 blur-[100px]" />
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
