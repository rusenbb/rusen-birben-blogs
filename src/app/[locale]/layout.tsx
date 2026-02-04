import type { Metadata } from 'next';
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import { Locale, locales, getDictionary } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from './layout.module.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
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
      <body className={`${playfair.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
        <div className={styles.langSwitcherContainer}>
          <LanguageSwitcher currentLocale={params.locale} />
        </div>
        {children}
      </body>
    </html>
  );
}
