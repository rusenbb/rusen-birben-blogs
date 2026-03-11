'use client';

import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Series } from '@/lib/blog';
import { Dictionary, Locale } from '@/lib/i18n';
import { paginateItems } from '@/lib/pagination';
import { Pagination } from './Pagination';
import { PrefetchLink } from './PrefetchLink';
import { usePersistentPage } from './usePersistentPage';
import styles from '@/app/[locale]/series/series.module.css';

interface SeriesArchiveProps {
  locale: Locale;
  dict: Dictionary;
  allSeries: Series[];
  seriesPerPage: number;
}

export function SeriesArchive({
  locale,
  dict,
  allSeries,
  seriesPerPage,
}: SeriesArchiveProps) {
  const [currentPage, setCurrentPage] = usePersistentPage('pagination:archive:series');
  const pagination = paginateItems(allSeries, currentPage, seriesPerPage);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href={`/${locale}`} className={styles.backLink}>
          <FaArrowLeft />
          <span>{dict.blog.backToHome}</span>
        </Link>
        <h1 className={styles.title}>{dict.series.title}</h1>
        <p className={styles.subtitle}>{dict.series.subtitle}</p>
      </div>

      {allSeries.length > 0 ? (
        <>
          <div className={styles.seriesList}>
            {pagination.items.map((series) => (
              <article key={series.name} className={styles.seriesCard}>
                <div className={styles.seriesHeader}>
                  <div>
                    <h2 className={styles.seriesName}>{series.name}</h2>
                    <p className={styles.seriesCount}>
                      {series.posts.length} {dict.series.partsCount}
                    </p>
                  </div>
                  <PrefetchLink href={`/${locale}/blog/${series.posts[0].slug}`} className={styles.seriesStart}>
                    {dict.series.startReading} <FaArrowRight />
                  </PrefetchLink>
                </div>

                <div className={styles.posts}>
                  {series.posts.map((post, index) => (
                    <PrefetchLink key={post.slug} href={`/${locale}/blog/${post.slug}`} className={styles.postLink}>
                      <span className={styles.postNumber}>{index + 1}</span>
                      <span className={styles.postInfo}>
                        <span className={styles.postTitle}>{post.title}</span>
                        <span className={styles.postMeta}>{post.date}</span>
                      </span>
                    </PrefetchLink>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            labels={dict.pagination}
          />
        </>
      ) : (
        <div className={styles.empty}>
          <p>{dict.series.empty}</p>
        </div>
      )}
    </main>
  );
}
