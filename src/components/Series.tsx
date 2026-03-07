import { PrefetchLink } from './PrefetchLink';
import { BlogPostMeta } from '@/lib/blog';
import { Locale } from '@/lib/i18n';
import styles from './Series.module.css';

interface SeriesProps {
  seriesName: string;
  posts: BlogPostMeta[];
  currentSlug: string;
  locale: Locale;
}

export function Series({ seriesName, posts, currentSlug, locale }: SeriesProps) {
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);
  const currentPost = posts[currentIndex];
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>Series</span>
        <h3 className={styles.title}>{seriesName}</h3>
        <span className={styles.progress}>
          Part {currentIndex + 1} of {posts.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${((currentIndex + 1) / posts.length) * 100}%` }}
        />
      </div>

      {/* Series list */}
      <nav className={styles.list} aria-label="Series posts">
        {posts.map((post, index) => {
          const isCurrent = post.slug === currentSlug;
          const isCompleted = index < currentIndex;
          
          return (
            <PrefetchLink
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className={`${styles.item} ${isCurrent ? styles.current : ''} ${isCompleted ? styles.completed : ''}`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <span className={styles.number}>
                {isCompleted ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span className={styles.itemTitle}>{post.title}</span>
              {isCurrent && <span className={styles.currentIndicator}>You are here</span>}
            </PrefetchLink>
          );
        })}
      </nav>

      {/* Navigation buttons */}
      <div className={styles.navigation}>
        {prevPost ? (
          <PrefetchLink
            href={`/${locale}/blog/${prevPost.slug}`}
            className={styles.navButton}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>
              <span className={styles.navLabel}>Previous</span>
              <span className={styles.navTitle}>{prevPost.title}</span>
            </span>
          </PrefetchLink>
        ) : (
          <div />
        )}
        
        {nextPost ? (
          <PrefetchLink
            href={`/${locale}/blog/${nextPost.slug}`}
            className={`${styles.navButton} ${styles.next}`}
          >
            <span>
              <span className={styles.navLabel}>Next</span>
              <span className={styles.navTitle}>{nextPost.title}</span>
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </PrefetchLink>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
