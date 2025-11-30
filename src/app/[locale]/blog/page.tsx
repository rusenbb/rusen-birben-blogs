import { getAllPosts } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';
import styles from './blog.module.css';
import Link from 'next/link';
import { FaArrowLeft, FaPen } from 'react-icons/fa';

interface Props {
  params: { locale: Locale };
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

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href={`/${params.locale}`} className={styles.backLink}>
          <FaArrowLeft />
          <span>{dict.blog.backToHome}</span>
        </Link>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>{dict.blog.subtitle}</p>
      </div>

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
              <span className={styles.readMore}>{dict.blog.readMore}</span>
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

