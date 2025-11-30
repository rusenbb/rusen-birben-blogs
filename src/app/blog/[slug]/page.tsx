import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './post.module.css';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | Ruşen Birben`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <article className={styles.article}>
        <Link href="/blog" className={styles.backLink}>
          <FaArrowLeft />
          <span>Back to blog</span>
        </Link>

        <header className={styles.header}>
          <time className={styles.date}>{post.date}</time>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.description}>{post.description}</p>
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className={styles.footer}>
          <Link href="/blog" className={styles.footerLink}>
            ← Back to all posts
          </Link>
        </footer>
      </article>
    </main>
  );
}

