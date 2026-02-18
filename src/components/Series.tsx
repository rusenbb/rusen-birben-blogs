import { PrefetchLink } from './PrefetchLink';
import { BlogPostMeta } from '@/lib/blog';
import { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/i18n';
import styles from './Series.module.css';

interface SeriesProps {
  seriesName: string;
  posts: BlogPostMeta[];
  currentSlug: string;
  locale: Locale;
  dict: Dictionary;
}

export function Series({ seriesName, posts, currentSlug, locale, dict }: SeriesProps) {
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>{dict.series.badge}</span>
        <span className={styles.separator}>·</span>
        <span className={styles.title}>{seriesName}</span>
        <span className={styles.separator}>·</span>
        <span className={styles.progress}>
          {dict.series.part} {currentIndex + 1} {dict.series.of} {posts.length}
        </span>
      </div>

      <nav className={styles.list} aria-label="Series posts">
        {posts.map((post, index) => {
          const isCurrent = post.slug === currentSlug;

          return isCurrent ? (
            <span
              key={post.slug}
              className={`${styles.item} ${styles.current}`}
              aria-current="page"
            >
              <span className={styles.number}>{index + 1}.</span>
              <span className={styles.itemTitle}>{post.title}</span>
            </span>
          ) : (
            <PrefetchLink
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className={styles.item}
            >
              <span className={styles.number}>{index + 1}.</span>
              <span className={styles.itemTitle}>{post.title}</span>
            </PrefetchLink>
          );
        })}
      </nav>

      {(prevPost || nextPost) && (
        <div className={styles.navigation}>
          {prevPost ? (
            <PrefetchLink
              href={`/${locale}/blog/${prevPost.slug}`}
              className={styles.navLink}
            >
              ← {dict.series.previous}
            </PrefetchLink>
          ) : (
            <span />
          )}
          {nextPost ? (
            <PrefetchLink
              href={`/${locale}/blog/${nextPost.slug}`}
              className={`${styles.navLink} ${styles.navNext}`}
            >
              {dict.series.next} →
            </PrefetchLink>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
