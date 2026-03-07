import { getAllPosts, getAllTags } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';
import styles from './blog.module.css';
import Link from 'next/link';
import { FaArrowLeft, FaPen, FaRss } from 'react-icons/fa';

interface Props {
  params: { locale: Locale };
}

// Helper to create URL-safe tag slug (handles Turkish chars)
function slugifyTag(tag: string): string {
  const turkishMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U',
  };
  
  return tag
    .toLowerCase()
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export async function generateMetadata({ params }: Props) {
  const dict = getDictionary(params.locale);
  return {
    title: `Blog | ${dict.hero.name}`,
    description: dict.blog.subtitle,
  };
}

export default function BlogPage({ params }: Props) {
  const dict = getDictionary(params.locale);
  const posts = getAllPosts(params.locale);
  const tags = getAllTags(params.locale);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Link href={`/${params.locale}`} className={styles.backLink}>
            <FaArrowLeft />
            <span>{dict.blog.backToHome}</span>
          </Link>
          <Link href={`/${params.locale}/feed.xml`} className={styles.rssLink} title={dict.blog.rss}>
            <FaRss />
            <span>{dict.blog.rss}</span>
          </Link>
        </div>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>{dict.blog.subtitle}</p>
      </div>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className={styles.tagFilters}>
          <span className={styles.filterLabel}>{dict.blog.filterByTag}:</span>
          <div className={styles.tagChips}>
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/${params.locale}/tags/${slugifyTag(tag)}`}
                className={styles.tagChip}
              >
                {tag} <span className={styles.tagCount}>({count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {posts.length > 0 ? (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/${params.locale}/blog/${post.slug}`} className={styles.postCard}>
              <div className={styles.postHeader}>
                <time className={styles.postDate}>{post.date}</time>
                {post.tags && post.tags.length > 0 && (
                  <div className={styles.postTags}>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postDescription}>{post.description}</p>
              <span className={styles.readMore}>{dict.blog.readMore} &rarr;</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <FaPen className={styles.emptyIcon} />
          <p>{dict.blog.empty}</p>
        </div>
      )}
    </main>
  );
}
