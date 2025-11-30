import { getAllPosts } from '@/lib/blog';
import styles from './blog.module.css';
import Link from 'next/link';
import { FaArrowLeft, FaPen } from 'react-icons/fa';

export const metadata = {
  title: 'Blog | Ruşen Birben',
  description: 'Thoughts on AI, engineering, and more.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <FaArrowLeft />
          <span>Back to home</span>
        </Link>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>Thoughts on AI, engineering, and more.</p>
      </div>

      {posts.length > 0 ? (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
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
              <span className={styles.readMore}>Read more →</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <FaPen className={styles.emptyIcon} />
          <p>No blog posts yet. Check back soon!</p>
        </div>
      )}
    </main>
  );
}

