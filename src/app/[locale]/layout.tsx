import type { Metadata } from 'next';
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import { Locale, locales, getDictionary } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { AccessibilitySettings } from '@/components/AccessibilitySettings';
import { TranslationProvider } from '@/components/TranslationProvider';
import { ViewTransition } from '@/components/ViewTransition';
import { generateMetadata as generateSEOMetadata, generateWebsiteStructuredData } from '@/lib/seo';
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
  
  return generateSEOMetadata({
    title: dict.hero.name,
    description: dict.hero.bio,
    locale: params.locale,
  });
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const structuredData = generateWebsiteStructuredData();
  
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
        <TranslationProvider>
          <ViewTransition>
            <div className={styles.controlsContainer}>
              <LanguageSwitcher currentLocale={params.locale} />
              <AccessibilitySettings />
            </div>
            {children}
          </ViewTransition>
        </TranslationProvider>
      </body>
    </html>
  );
}
