import { getPostBySlug, getAllPostSlugs, getPostsBySeries, getTranslatedPostUrl } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaClock, FaCalendar } from 'react-icons/fa';
import { Series } from '@/components/Series';
import { PostTranslationSetter } from '@/components/PostTranslationSetter';
import { generateMetadata as generateSEOMetadata, generateArticleStructuredData } from '@/lib/seo';
import styles from './post.module.css';

interface Props {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map(({ locale, slug }) => ({ locale, slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.locale, params.slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    type: 'article',
    publishedAt: post.date,
    authors: [post.locale === 'tr' ? 'Rusen Birben' : 'Rusen Birben'],
    tags: post.tags,
    locale: params.locale,
    pathname: `/blog/${params.slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const dict = getDictionary(params.locale);
  const post = await getPostBySlug(params.locale, params.slug);

  if (!post) {
    notFound();
  }

  // Get series posts if this post is part of a series
  const seriesPosts = post.series 
    ? getPostsBySeries(params.locale, post.series)
    : [];

  // Calculate translation URL for the other locale
  const otherLocale = params.locale === 'en' ? 'tr' : 'en';
  const translationUrl = getTranslatedPostUrl(
    params.locale,
    otherLocale,
    post.slug,
    post.translationKey
  );

  // Generate structured data
  const structuredData = generateArticleStructuredData({
    slug: post.slug,
    locale: post.locale,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags,
    series: post.series,
    seriesOrder: post.seriesOrder,
    readingTime: post.readingTime,
  }, params.locale);

  return (
    <>
      {/* Set translation URL in context for LanguageSwitcher */}
      <PostTranslationSetter translationUrl={translationUrl} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Table of Contents Sidebar */}
          {post.headings.length > 0 && (
            <aside className={styles.tocSidebar}>
              <nav className={styles.toc}>
                <h2 className={styles.tocTitle}>{params.locale === 'en' ? 'On this page' : 'Bu sayfada'}</h2>
                <ul className={styles.tocList}>
                  {post.headings.map((heading) => (
                    <li 
                      key={heading.id} 
                      className={`
                        ${styles.tocItem} 
                        ${heading.level === 1 ? styles.tocItemLevel1 : ''}
                        ${heading.level === 3 ? styles.tocItemSub : ''}
                      `}
                    >
                      <a href={`#${heading.id}`} className={styles.tocLink}>
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}

          <article className={styles.article}>
            <Link href={`/${params.locale}/blog`} className={styles.backLink}>
              <FaArrowLeft />
              <span>{dict.blog.backToBlog}</span>
            </Link>

            <header className={styles.header}>
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <FaCalendar />
                  <time>{post.date}</time>
                </span>
                <span className={styles.metaItem}>
                  <FaClock />
                  <span>{post.readingTime} {params.locale === 'en' ? 'min read' : 'dk okuma'}</span>
                </span>
              </div>
              
              <h1 className={styles.title}>{post.title}</h1>
              <p className={styles.description}>{post.description}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/${params.locale}/tags/${slugifyTag(tag)}`}
                      className={styles.tag}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Series Navigation */}
            {post.series && seriesPosts.length > 1 && (
              <Series
                seriesName={post.series}
                posts={seriesPosts}
                currentSlug={post.slug}
                locale={params.locale}
              />
            )}

            <div 
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <footer className={styles.footer}>
              <Link href={`/${params.locale}/blog`} className={styles.footerLink}>
                {dict.blog.backToAll}
              </Link>
            </footer>
          </article>
        </div>
      </main>
    </>
  );
}

// Helper to create URL-safe tag slug (handles Turkish chars)
function slugifyTag(tag: string): string {
  const turkishMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U',
  };
  
  return tag
    .toLowerCase()
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
