'use client';

import Link from 'next/link';

export default function BlogPostError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>
        Something went wrong
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        This post could not be rendered.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: 'none',
            border: '1px solid var(--border)',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            padding: '0.5rem 1rem',
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
