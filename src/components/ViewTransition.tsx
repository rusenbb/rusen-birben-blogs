import { ReactNode } from 'react';

interface ViewTransitionProps {
  children: ReactNode;
}

export function ViewTransition({ children }: ViewTransitionProps) {
  return (
    <div data-view-transition>
      {children}
    </div>
  );
}
