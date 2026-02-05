'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './LanguageSwitcher.module.css';
import { Locale, locales } from '@/lib/i18n';
import { useTranslationUrl } from './TranslationProvider';

interface Props {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: Props) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const translationUrl = useTranslationUrl();  // ← Get translation from context
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const getLocalizedPath = (targetLocale: Locale) => {
    // If we have a direct translation URL for this target locale, use it
    if (translationUrl && targetLocale !== currentLocale) {
      return translationUrl;
    }
    
    const segments = pathname.split('/');
    
    // If on a blog post page without translation, redirect to blog listing
    if (segments.length > 3 && segments[2] === 'blog') {
      return `/${targetLocale}/blog`;
    }
    
    segments[1] = targetLocale;
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
