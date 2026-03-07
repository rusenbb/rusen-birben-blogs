'use client';

import Link from 'next/link';
import { useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface PrefetchLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
}

export function PrefetchLink({ href, children, className, prefetch = true }: PrefetchLinkProps) {
  const router = useRouter();

  const handleMouseEnter = useCallback(() => {
    if (prefetch) {
      router.prefetch(href);
    }
  }, [href, prefetch, router]);

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
