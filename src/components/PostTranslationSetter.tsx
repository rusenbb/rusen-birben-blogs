'use client';

import { useEffect } from 'react';
import { useTranslation } from './TranslationProvider';
import { Locale } from '@/lib/i18n';

interface Props {
  translationUrl: string | null;
}

// This component sets the translation URL in the context when rendered
export function PostTranslationSetter({ translationUrl }: Props) {
  const { setTranslationUrl } = useTranslation();

  useEffect(() => {
    setTranslationUrl(translationUrl);
    
    // Clear translation URL when component unmounts
    return () => {
      setTranslationUrl(null);
    };
  }, [translationUrl, setTranslationUrl]);

  return null;  // This component doesn't render anything
}
