import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Pagination } from '@/components/Pagination';
import { PrefetchLink } from '@/components/PrefetchLink';
import { getAllSeries } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';
import { paginateItems, parsePageParam } from '@/lib/pagination';
import styles from './series.module.css';

interface Props {
  params: { locale: Locale };
  searchParams?: {
    page?: string | string[];
  };
}

const SERIES_PER_PAGE = 10;

export async function generateMetadata({ params }: Props) {
  const dict = getDictionary(params.locale);

  return {
    title: `${dict.series.title} | ${dict.hero.name}`,
    description: dict.series.subtitle,
  };
}

export default function SeriesPage({ params, searchParams }: Props) {
  const dict = getDictionary(params.locale);
  const allSeries = getAllSeries(params.locale);
  const page = parsePageParam(searchParams?.page);
  const pagination = paginateItems(allSeries, page, SERIES_PER_PAGE);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href={`/${params.locale}`} className={styles.backLink}>
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
                  <PrefetchLink
                    href={`/${params.locale}/blog/${series.posts[0].slug}`}
                    className={styles.seriesStart}
                  >
                    {dict.series.startReading} <FaArrowRight />
                  </PrefetchLink>
                </div>

                <div className={styles.posts}>
                  {series.posts.map((post, index) => (
                    <PrefetchLink
                      key={post.slug}
                      href={`/${params.locale}/blog/${post.slug}`}
                      className={styles.postLink}
                    >
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
            basePath={`/${params.locale}/series`}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
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
