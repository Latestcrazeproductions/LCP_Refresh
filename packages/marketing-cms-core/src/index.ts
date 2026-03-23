'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { CMSConfig, CMSContextType } from './types';

export * from './types';
export * from './logic';

const CMSContext = createContext<CMSContextType | null>(null);

export function CMSProvider({
  content,
  config,
  children,
}: {
  content: Record<string, any>;
  config: CMSConfig;
  children: ReactNode;
}) {
  return (
    <CMSContext.Provider value={{ content, config }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS(): CMSContextType {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}

export function useContent<T>(key: string): T {
  const { content } = useCMS();
  return content[key] as T;
}
