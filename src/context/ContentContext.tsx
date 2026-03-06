'use client';

import { createContext, useContext } from 'react';
import type { SiteContent } from '@/lib/content';

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return ctx;
}
