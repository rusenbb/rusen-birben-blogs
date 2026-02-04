import { getPostsByTag, getAllTags } from '@/lib/blog';
import { Locale, getDictionary, locales } from '@/lib/i18n';
import styles from '../tags.module.css';
import Link from 'next/link';
import { FaArrowLeft, FaTag } from 'react-icons/fa';

interface Props {
  params: { locale: Locale; tag: string };
}

// Helper to create URL-safe tag slug
function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

export async function generateStaticParams() {
  const params: { locale: Locale; tag: string }[] = [];
  
  for (const locale of locales) {
    const tags = getAllTags(locale);
    for (const { tag } of tags) {
      params.push({
        locale,
        tag: slugifyTag(tag),
      });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: Props) {
  const dict = getDictionary(params.locale);
  // Find the original tag name from the slug
  const allTags = getAllTags(params.locale);
  const originalTag = allTags.find(({ tag }) => slugifyTag(tag) === params.tag)?.tag || params.tag;
  
  return {
    title: `${dict.sections.postsTagged} "${originalTag}" | ${dict.hero.name}`,
    description: `${dict.sections.postsTagged} ${originalTag}`,
  };
}

export default function TagPage({ params }: Props) {
  const dict = getDictionary(params.locale);
  // Find the original tag name from the slug
  const allTags = getAllTags(params.locale);
  const tag = allTags.find(({ tag }) => slugifyTag(tag) === params.tag)?.tag || params.tag;
  const posts = getPostsByTag(params.locale, tag);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href={`/${params.locale}/tags`} className={styles.backLink}>
          <FaArrowLeft />
          <span>{dict.blog.backToTags}</span>
        </Link>
        <div className={styles.postsHeader}>
          <FaTag />
          <h1 className={styles.postsTitle}>{tag}</h1>
          <span className={styles.postsCount}>
            ({posts.length} {dict.tags.postsCount})
          </span>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${params.locale}/blog/${post.slug}`}
              className={styles.postCard}
            >
              <div className={styles.postHeader}>
                <time className={styles.postDate}>{post.date}</time>
                {post.tags && post.tags.length > 0 && (
                  <div className={styles.postTags}>
                    {post.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
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
          <FaTag className={styles.emptyIcon} />
          <p>{dict.blog.empty}</p>
        </div>
      )}
    </main>
  );
}
