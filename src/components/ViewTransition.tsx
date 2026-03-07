'use client';

import { useCallback, useEffect, useRef, ReactNode } from 'react';

interface ViewTransitionProps {
  children: ReactNode;
}

export function ViewTransition({ children }: ViewTransitionProps) {
  const startViewTransitionRef = useRef<((callback: () => void) => void) | null>(null);

  useEffect(() => {
    // Check for View Transitions API support
    if ('startViewTransition' in document) {
      startViewTransitionRef.current = (document as Document & { startViewTransition: (callback: () => void) => void }).startViewTransition.bind(document);
    }
  }, []);

  const handleTransition = useCallback((callback: () => void) => {
    if (startViewTransitionRef.current) {
      startViewTransitionRef.current(callback);
    } else {
      callback();
    }
  }, []);

  return (
    <div data-view-transition>
      {children}
    </div>
  );
}

// Hook to use view transitions programmatically
export function useViewTransition() {
  const startTransition = useCallback((callback: () => void) => {
    if ('startViewTransition' in document) {
      (document as Document & { startViewTransition: (callback: () => void) => void }).startViewTransition(callback);
    } else {
      callback();
    }
  }, []);

  return { startTransition };
}
