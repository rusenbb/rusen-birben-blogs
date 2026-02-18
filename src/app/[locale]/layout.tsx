import type { Metadata } from 'next';
import { Playfair_Display, Inter, IBM_Plex_Mono } from 'next/font/google';
import Link from 'next/link';
import '../globals.css';
import 'katex/dist/katex.min.css';
import { Locale, locales, getDictionary } from '@/lib/i18n';
import { ThemeProvider } from '@/components/ThemeProvider';
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
  const dict = getDictionary(params.locale);

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var f=localStorage.getItem('font-size');if(f){var m={small:'14px',normal:'16px',large:'18px',xlarge:'20px'};if(m[f])document.documentElement.style.fontSize=m[f]}var r=localStorage.getItem('reduced-motion');if(r==='true')document.documentElement.setAttribute('data-reduced-motion','true')}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
        <ThemeProvider>
          <TranslationProvider>
            <ViewTransition>
              <nav className={styles.navbar}>
                <div className={styles.navInner}>
                  <div className={styles.navLinks}>
                    <Link href={`/${params.locale}/blog`} className={styles.navLink}>
                      {dict.nav.blog}
                    </Link>
                    <Link href={`/${params.locale}/tags`} className={styles.navLink}>
                      {dict.nav.tags}
                    </Link>
                    <Link href={`/${params.locale}/series`} className={styles.navLink}>
                      {dict.nav.series}
                    </Link>
                  </div>
                  <div className={styles.navControls}>
                    <LanguageSwitcher currentLocale={params.locale} />
                    <AccessibilitySettings locale={params.locale} />
                  </div>
                </div>
              </nav>
              {children}
            </ViewTransition>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
