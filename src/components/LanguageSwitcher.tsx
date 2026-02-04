'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './LanguageSwitcher.module.css';
import { Locale, locales } from '@/lib/i18n';

interface Props {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: Props) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const getLocalizedPath = (locale: Locale) => {
    const segments = pathname.split('/');
    
    // If on a blog post page (e.g., /en/blog/some-post), redirect to blog listing
    // because post slugs are different per language
    if (segments.length > 3 && segments[2] === 'blog') {
      return `/${locale}/blog`;
    }
    
    segments[1] = locale;
    return segments.join('/');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={styles.switcher}>
        {locales.map((locale) => (
          <span
            key={locale}
            className={`${styles.option} ${locale === currentLocale ? styles.active : ''}`}
          >
            {locale === 'en' ? 'EN' : 'TR'}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.switcher}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className={`${styles.option} ${locale === currentLocale ? styles.active : ''}`}
        >
          {locale === 'en' ? 'EN' : 'TR'}
        </Link>
      ))}
    </div>
  );
}
