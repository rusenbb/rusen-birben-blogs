'use client';

import Link from 'next/link';
import { FaArrowRight, FaClock, FaEnvelope, FaGithub, FaLinkedin, FaRss } from 'react-icons/fa';
import { BlogPostMeta, Series } from '@/lib/blog';
import { Dictionary, Locale } from '@/lib/i18n';
import { paginateItems } from '@/lib/pagination';
import { Pagination } from './Pagination';
import { PrefetchLink } from './PrefetchLink';
import { usePersistentPage } from './usePersistentPage';
import styles from '@/app/[locale]/page.module.css';

interface TagCount {
  tag: string;
  count: number;
}

interface HomeContentProps {
  locale: Locale;
  dict: Dictionary;
  allPosts: BlogPostMeta[];
  allSeries: Series[];
  allTags: TagCount[];
}

const HOME_BLOGS_PER_PAGE = 10;
const HOME_SERIES_PER_PAGE = 5;

function slugifyTag(tag: string): string {
  const turkishMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U',
  };

  return tag
    .toLowerCase()
    .split('')
    .map((char) => turkishMap[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function HomeContent({ locale, dict, allPosts, allSeries, allTags }: HomeContentProps) {
  const [blogPage, setBlogPage] = usePersistentPage('pagination:home:blog');
  const [seriesPage, setSeriesPage] = usePersistentPage('pagination:home:series');

  const blogPagination = paginateItems(allPosts, blogPage, HOME_BLOGS_PER_PAGE);
  const seriesPagination = paginateItems(allSeries, seriesPage, HOME_SERIES_PER_PAGE);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.name}>{dict.hero.name}</h1>
          <p className={styles.title}>{dict.hero.title}</p>
        </div>
        <div className={styles.headerRight}>
          <a href="https://github.com/rusenbb" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/rusenbirben" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
            <FaLinkedin />
          </a>
          <a href="mailto:rusenbirben@gmail.com" className={styles.iconLink}>
            <FaEnvelope />
          </a>
          <Link href={`/${locale}/feed.xml`} className={styles.iconLink} title={dict.blog.rss}>
            <FaRss />
          </Link>
        </div>
      </header>

      <section className={styles.about}>
        <div className={styles.aboutText}>
          <p>{dict.hero.bio}</p>
        </div>
      </section>

      {allTags.length > 0 && (
        <section className={styles.section} id="tags">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{dict.sections.tags}</h2>
            <Link href={`/${locale}/tags`} className={styles.viewAllLink}>
              {dict.sections.viewAll} →
            </Link>
          </div>
          <div className={styles.tagsContainer}>
            {allTags.slice(0, 8).map(({ tag, count }) => (
              <PrefetchLink key={tag} href={`/${locale}/tags/${slugifyTag(tag)}`} className={styles.tagChip}>
                {tag} <span className={styles.tagCount}>({count})</span>
              </PrefetchLink>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section} id="series">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{dict.sections.series}</h2>
          <Link href={`/${locale}/series`} className={styles.viewAllLink}>
            {dict.sections.viewAll} →
          </Link>
        </div>
        {allSeries.length > 0 ? (
          <>
            <div className={styles.seriesList}>
              {seriesPagination.items.map((series) => (
                <article key={series.name} className={styles.seriesCard}>
                  <div className={styles.seriesCardTop}>
                    <span className={styles.seriesCount}>
                      {series.posts.length} {dict.series.partsCount}
                    </span>
                  </div>
                  <h3 className={styles.seriesName}>{series.name}</h3>
                  <p className={styles.seriesPreview}>
                    {series.posts.slice(0, 2).map((post) => post.title).join(' · ')}
                  </p>
                  <PrefetchLink href={`/${locale}/blog/${series.posts[0].slug}`} className={styles.seriesLink}>
                    {dict.series.startReading} <FaArrowRight />
                  </PrefetchLink>
                </article>
              ))}
            </div>
            <Pagination
              currentPage={seriesPagination.currentPage}
              totalPages={seriesPagination.totalPages}
              onPageChange={setSeriesPage}
              labels={dict.pagination}
            />
          </>
        ) : (
          <div className={styles.blogEmpty}>
            <p>{dict.series.empty}</p>
          </div>
        )}
      </section>

      <section className={styles.section} id="blog">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{dict.sections.blog}</h2>
          <Link href={`/${locale}/blog`} className={styles.viewAllLink}>
            {dict.sections.viewAll} →
          </Link>
        </div>
        {allPosts.length > 0 ? (
          <>
            <div className={styles.blogGrid}>
              {blogPagination.items.map((post) => (
                <PrefetchLink key={post.slug} href={`/${locale}/blog/${post.slug}`} className={styles.blogCard}>
                  <div className={styles.blogMeta}>
                    <span className={styles.blogDate}>{post.date}</span>
                    <span className={styles.blogReadingTime}>
                      <FaClock style={{ fontSize: '0.7em' }} />
                      {post.readingTime} min
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <div className={styles.blogTags}>
                        {post.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className={styles.blogTitle}>{post.title}</h3>
                  <p className={styles.blogDescription}>{post.description}</p>
                </PrefetchLink>
              ))}
            </div>
            <Pagination
              currentPage={blogPagination.currentPage}
              totalPages={blogPagination.totalPages}
              onPageChange={setBlogPage}
              labels={dict.pagination}
            />
          </>
        ) : (
          <div className={styles.blogEmpty}>
            <p>{dict.blog.empty}</p>
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>© {new Date().getFullYear()} {dict.hero.name}</span>
          <div className={styles.footerLinks}>
            <a href="https://rusen.ai" target="_blank" rel="noopener noreferrer">
              {dict.footer.visitPortfolio}
            </a>
            <a href={`/${locale}/feed.xml`}>RSS</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
