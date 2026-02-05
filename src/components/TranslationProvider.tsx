'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TranslationContextType {
  translationUrl: string | null;
  setTranslationUrl: (url: string | null) => void;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [translationUrl, setTranslationUrl] = useState<string | null>(null);

  return (
    <TranslationContext.Provider value={{ translationUrl, setTranslationUrl }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

// Hook to get just the translation URL (safe to use outside provider)
export function useTranslationUrl(): string | null {
  const context = useContext(TranslationContext);
  return context?.translationUrl ?? null;
}
