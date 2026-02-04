import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import { Locale, getDictionary, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './post.module.css';

interface Props {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map(({ locale, slug }) => ({ locale, slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.locale, params.slug);
  const dict = getDictionary(params.locale);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | ${dict.hero.name}`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const dict = getDictionary(params.locale);
  const post = await getPostBySlug(params.locale, params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Table of Contents Sidebar */}
        {post.headings.length > 0 && (
          <aside className={styles.tocSidebar}>
            <nav className={styles.toc}>
              <h2 className={styles.tocTitle}>{params.locale === 'en' ? 'On this page' : 'Bu sayfada'}</h2>
              <ul className={styles.tocList}>
                {post.headings.map((heading) => (
                  <li 
                    key={heading.id} 
                    className={`${styles.tocItem} ${heading.level === 3 ? styles.tocItemSub : ''}`}
                  >
                    <a href={`#${heading.id}`} className={styles.tocLink}>
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        <article className={styles.article}>
          <Link href={`/${params.locale}/blog`} className={styles.backLink}>
            <FaArrowLeft />
            <span>{dict.blog.backToBlog}</span>
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
            <Link href={`/${params.locale}/blog`} className={styles.footerLink}>
              {dict.blog.backToAll}
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
