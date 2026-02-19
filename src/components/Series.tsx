import { PrefetchLink } from './PrefetchLink';
import { BlogPostMeta } from '@/lib/blog';
import { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/i18n';
import { slugifySeries } from '@/lib/utils';
import { FaLayerGroup } from 'react-icons/fa';
import styles from './Series.module.css';

interface SeriesProps {
  seriesName: string;
  posts: BlogPostMeta[];
  currentSlug: string;
  locale: Locale;
  dict: Dictionary;
}

export function SeriesMeta({ seriesName, posts, currentSlug, locale, dict }: SeriesProps) {
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

  return (
    <span className={styles.meta}>
      <FaLayerGroup />
      <PrefetchLink
        href={`/${locale}/series/${slugifySeries(seriesName)}`}
        className={styles.metaLink}
      >
        {dict.series.part} {currentIndex + 1} {dict.series.of} {posts.length} · {seriesName}
      </PrefetchLink>
    </span>
  );
}

export function SeriesNav({ seriesName, posts, currentSlug, locale, dict }: SeriesProps) {
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  if (!prevPost && !nextPost) return null;

  return (
    <nav className={styles.nav} aria-label="Series navigation">
      {prevPost ? (
        <PrefetchLink
          href={`/${locale}/blog/${prevPost.slug}`}
          className={styles.navLink}
        >
          <span className={styles.navLabel}>← {dict.series.previous}</span>
          <span className={styles.navTitle}>{prevPost.title}</span>
        </PrefetchLink>
      ) : (
        <span />
      )}
      {nextPost ? (
        <PrefetchLink
          href={`/${locale}/blog/${nextPost.slug}`}
          className={`${styles.navLink} ${styles.navNext}`}
        >
          <span className={styles.navLabel}>{dict.series.next} →</span>
          <span className={styles.navTitle}>{nextPost.title}</span>
        </PrefetchLink>
      ) : (
        <span />
      )}
    </nav>
  );
}
