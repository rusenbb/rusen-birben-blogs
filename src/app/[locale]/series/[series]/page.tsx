import { getAllSeries, getPostsBySeries } from '@/lib/blog';
import { Locale, getDictionary, locales } from '@/lib/i18n';
import { slugifySeries } from '@/lib/utils';
import styles from '../series.module.css';
import Link from 'next/link';
import { FaArrowLeft, FaClock } from 'react-icons/fa';

interface Props {
  params: { locale: Locale; series: string };
}

export async function generateStaticParams() {
  const params: { locale: Locale; series: string }[] = [];

  for (const locale of locales) {
    const allSeries = getAllSeries(locale);
    for (const series of allSeries) {
      params.push({
        locale,
        series: slugifySeries(series.name),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props) {
  const dict = getDictionary(params.locale);
  const allSeries = getAllSeries(params.locale);
  const seriesName = allSeries.find((s) => slugifySeries(s.name) === params.series)?.name || params.series;

  return {
    title: `${seriesName} | ${dict.series.title} | ${dict.hero.name}`,
    description: `${seriesName} — ${dict.series.subtitle}`,
  };
}

export default function SeriesDetailPage({ params }: Props) {
  const dict = getDictionary(params.locale);
  const allSeries = getAllSeries(params.locale);
  const seriesName = allSeries.find((s) => slugifySeries(s.name) === params.series)?.name || params.series;
  const posts = getPostsBySeries(params.locale, seriesName);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href={`/${params.locale}/series`} className={styles.backLink}>
          <FaArrowLeft />
          <span>{dict.series.backToSeries}</span>
        </Link>
        <div className={styles.detailHeader}>
          <h1 className={styles.detailTitle}>{seriesName}</h1>
          <span className={styles.detailCount}>
            {posts.length} {dict.series.postsCount}
          </span>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className={styles.postsList}>
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/${params.locale}/blog/${post.slug}`}
              className={styles.postCard}
            >
              <div className={styles.postMeta}>
                <span className={styles.postNumber}>{dict.series.part} {index + 1}</span>
                <span className={styles.postDate}>{post.date}</span>
                <span className={styles.postReading}>
                  <FaClock style={{ fontSize: '0.7em' }} />
                  {post.readingTime} {dict.blog.minRead}
                </span>
              </div>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postDescription}>{post.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>{dict.blog.empty}</p>
        </div>
      )}
    </main>
  );
}
