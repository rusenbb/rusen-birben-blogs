import { Metadata } from 'next';
import { BlogPostMeta } from './blog';
import { Locale } from './i18n';

const siteConfig = {
  name: 'Rusen Birben',
  description: 'Thoughts on software engineering, AI, and technology',
  url: 'https://rusen.ai/blog',
  author: 'Rusen Birben',
  twitterHandle: '@rusenb',
};

interface GenerateMetadataProps {
  title: string;
  description?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  modifiedAt?: string;
  authors?: string[];
  tags?: string[];
  locale: Locale;
  pathname?: string;
}

export function generateMetadata({
  title,
  description = siteConfig.description,
  type = 'website',
  publishedAt,
  modifiedAt,
  authors,
  tags,
  locale,
  pathname = '',
}: GenerateMetadataProps): Metadata {
  const url = `${siteConfig.url}/${locale}${pathname}`;
  // Use a static OG image for all pages (can be customized per-page later)
  const ogImage = `${siteConfig.url}/og/default.png`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    authors: authors?.map((name) => ({ name })),
    keywords: tags,
    openGraph: {
      type,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      siteName: siteConfig.name,
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        authors: authors,
        tags: tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteConfig.url}/en${pathname}`,
        'tr': `${siteConfig.url}/tr${pathname}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate JSON-LD structured data for articles
export function generateArticleStructuredData(
  post: BlogPostMeta,
  locale: Locale
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/favicon.ico`,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/${locale}/blog/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
    inLanguage: locale === 'tr' ? 'tr' : 'en',
  };
}

// Generate JSON-LD for the website
export function generateWebsiteStructuredData(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export { siteConfig };
