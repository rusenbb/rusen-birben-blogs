import Link from 'next/link';
import { ReactNode } from 'react';

interface PrefetchLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  [key: string]: unknown;
}

export function PrefetchLink({ href, children, className, prefetch = true, ...rest }: PrefetchLinkProps) {
  return (
    <Link href={href} className={className} prefetch={prefetch} {...rest}>
      {children}
    </Link>
  );
}
