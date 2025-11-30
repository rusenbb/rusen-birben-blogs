import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import '../globals.css';
import { Locale, locales, getDictionary } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from './layout.module.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const dict = getDictionary(params.locale);
  
  return {
    title: `${dict.hero.name} | ${dict.hero.title}`,
    description: dict.hero.bio,
    keywords: ['AI Engineer', 'Data Engineer', 'NLP', 'Machine Learning', 'Istanbul Technical University'],
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  return (
    <html lang={params.locale}>
      <body className={`${outfit.variable} ${jetbrainsMono.variable}`}>
        <div className={styles.langSwitcherContainer}>
          <LanguageSwitcher currentLocale={params.locale} />
        </div>
        {children}
      </body>
    </html>
  );
}

