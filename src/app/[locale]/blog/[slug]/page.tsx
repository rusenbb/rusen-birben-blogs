import { getPostBySlug, getAllPostSlugs, getPostsBySeries, getTranslatedPostUrl } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';
import { slugifyTag } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrefetchLink } from '@/components/PrefetchLink';
import { FaArrowLeft, FaClock, FaCalendar } from 'react-icons/fa';
import { SeriesMeta, SeriesNav } from '@/components/Series';
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
    authors: ['Rusen Birben'],
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
                <h2 className={styles.tocTitle}>{dict.blog.onThisPage}</h2>
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
                  <span>{post.readingTime} {dict.blog.minRead}</span>
                </span>
                {post.series && seriesPosts.length > 1 && (
                  <SeriesMeta
                    seriesName={post.series}
                    posts={seriesPosts}
                    currentSlug={post.slug}
                    locale={params.locale}
                    dict={dict}
                  />
                )}
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

            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Series Navigation */}
            {post.series && seriesPosts.length > 1 && (
              <SeriesNav
                seriesName={post.series}
                posts={seriesPosts}
                currentSlug={post.slug}
                locale={params.locale}
                dict={dict}
              />
            )}

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
