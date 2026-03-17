import { Suspense } from 'react';

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-nexus-black flex items-center justify-center">
          <span className="text-gray-400">Loading…</span>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
