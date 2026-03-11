'use client';

import { useEffect } from 'react';
import { Locale } from '@/lib/i18n';

interface LocaleEffectsProps {
  locale: Locale;
}

export function LocaleEffects({ locale }: LocaleEffectsProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem('preferred-locale', locale);
  }, [locale]);

  return null;
}
