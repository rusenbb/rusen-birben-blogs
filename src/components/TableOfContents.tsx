'use client';

import { useState, useEffect } from 'react';
import type { Heading } from '@/lib/blog';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  headings: Heading[];
  locale: string;
  variant?: 'sidebar' | 'mobile';
}

export function TableOfContents({ headings, locale, variant = 'sidebar' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    function onScroll() {
      let active = '';
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= 100) {
          active = el.id;
        }
      }
      setActiveId(active);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  const title = locale === 'en' ? 'On this page' : 'Bu sayfada';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reducedMotion = document.documentElement.getAttribute('data-reduced-motion') === 'true';
    el.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    setMobileOpen(false);
  };

  const renderLinks = () => (
    <ul className={styles.list}>
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={[
            styles.item,
            heading.level === 1 ? styles.level1 : '',
            heading.level === 3 ? styles.level3 : '',
            activeId === heading.id ? styles.active : '',
          ].filter(Boolean).join(' ')}
        >
          <a
            href={`#${heading.id}`}
            className={styles.link}
            onClick={(e) => handleClick(e, heading.id)}
            aria-current={activeId === heading.id ? 'true' : undefined}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === 'sidebar') {
    return (
      <aside className={styles.sidebar} aria-label={title}>
        <nav className={styles.nav}>
          <h2 className={styles.title}>{title}</h2>
          {renderLinks()}
        </nav>
      </aside>
    );
  }

  return (
    <div className={styles.mobile}>
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-expanded={mobileOpen}
      >
        <span>{title}</span>
        <span className={[styles.chevron, mobileOpen ? styles.chevronOpen : ''].filter(Boolean).join(' ')}>
          &#x25BE;
        </span>
      </button>
      {mobileOpen && (
        <nav className={styles.mobileNav} aria-label={title}>
          {renderLinks()}
        </nav>
      )}
    </div>
  );
}
