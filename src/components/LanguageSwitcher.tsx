'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './LanguageSwitcher.module.css';
import { Locale, locales } from '@/lib/i18n';

interface Props {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: Props) {
  const pathname = usePathname();
  
  const getLocalizedPath = (locale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

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

