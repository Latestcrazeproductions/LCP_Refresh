import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PageShellProps {
  children: ReactNode;
  forceSolidNav?: boolean;
}

export function PageShell({ children, forceSolidNav = true }: PageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-blue-500/30">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[120px]" />
      <Navbar forceSolidBackground={forceSolidNav} />
      {children}
      <Footer />
    </main>
  );
}
