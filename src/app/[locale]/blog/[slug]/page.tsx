import { getPostBySlug, getAllPostSlugs, getPostsBySeries, getTranslatedPostUrl } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrefetchLink } from '@/components/PrefetchLink';
import { FaArrowLeft, FaClock, FaCalendar } from 'react-icons/fa';
import { Series } from '@/components/Series';
import { PostTranslationSetter } from '@/components/PostTranslationSetter';
import { TableOfContents } from '@/components/TableOfContents';
import { generateMetadata as generateSEOMetadata, generateArticleStructuredData } from '@/lib/seo';
import { slugifyTag } from '@/lib/utils';
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
  const seriesPosts = post.seriesId
    ? getPostsBySeries(params.locale, post.seriesId)
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
          {/* Table of Contents Sidebar (desktop) */}
          {post.headings.length > 0 && (
            <TableOfContents headings={post.headings} locale={params.locale} variant="sidebar" />
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
                    <PrefetchLink
                      key={tag}
                      href={`/${params.locale}/tags/${slugifyTag(tag)}`}
                      className={styles.tag}
                    >
                      {tag}
                    </PrefetchLink>
                  ))}
                </div>
              )}
            </header>

            {/* Series Navigation */}
            {post.seriesId && post.series && seriesPosts.length > 1 && (
              <Series
                seriesName={post.series}
                posts={seriesPosts}
                currentSlug={post.slug}
                locale={params.locale}
                labels={{
                  badge: dict.series.badge,
                  progressPattern: dict.series.progressPattern,
                  currentIndicator: dict.series.currentIndicator,
                  previous: dict.series.previous,
                  next: dict.series.next,
                  postsAriaLabel: dict.series.postsAriaLabel,
                }}
              />
            )}

            {/* Table of Contents (mobile) */}
            {post.headings.length > 0 && (
              <TableOfContents headings={post.headings} locale={params.locale} variant="mobile" />
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
