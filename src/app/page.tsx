'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, defaultLocale, locales } from '@/lib/i18n';

function getPreferredLocale(): Locale {
  const savedLocale = localStorage.getItem('preferred-locale');

  if (savedLocale && locales.includes(savedLocale as Locale)) {
    return savedLocale as Locale;
  }

  const browserLocale = navigator.language.toLowerCase();
  return browserLocale.startsWith('tr') ? 'tr' : defaultLocale;
}

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${getPreferredLocale()}`);
  }, [router]);

  return null;
}
