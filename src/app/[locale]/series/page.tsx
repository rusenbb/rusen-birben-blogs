import { getAllSeries } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';
import { slugifySeries } from '@/lib/utils';
import styles from './series.module.css';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface Props {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: Props) {
  const dict = getDictionary(params.locale);
  return {
    title: `${dict.series.title} | ${dict.hero.name}`,
    description: dict.series.subtitle,
  };
}

export default function SeriesPage({ params }: Props) {
  const dict = getDictionary(params.locale);
  const allSeries = getAllSeries(params.locale);

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
        <div className={styles.seriesList}>
          {allSeries.map((series) => (
            <Link
              key={series.name}
              href={`/${params.locale}/series/${slugifySeries(series.name)}`}
              className={styles.seriesCard}
            >
              <span className={styles.seriesName}>{series.name}</span>
              <span className={styles.seriesCount}>
                {series.posts.length} {dict.series.postsCount}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>{dict.series.noSeries}</p>
        </div>
      )}
    </main>
  );
}
