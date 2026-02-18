import styles from './page.module.css';
import Link from 'next/link';
import { PrefetchLink } from '@/components/PrefetchLink';
import { FaGithub, FaLinkedin, FaEnvelope, FaRss, FaClock } from 'react-icons/fa';
import { Locale, getDictionary } from '@/lib/i18n';
import { getAllPosts } from '@/lib/blog';


interface Props {
  params: { locale: Locale };
}

export default function Home({ params }: Props) {
  const dict = getDictionary(params.locale);
  const allPosts = getAllPosts(params.locale);

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.name}>{dict.hero.name}</h1>
        <p className={styles.title}>{dict.hero.title}</p>
      </header>

      {/* About */}
      <section className={styles.about}>
        <div className={styles.aboutText}>
          <p>{dict.hero.bio}</p>
        </div>
      </section>

      {/* Blog Section */}
      <section className={styles.section} id="blog">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{dict.sections.blog}</h2>
          <Link href={`/${params.locale}/blog`} className={styles.viewAllLink}>
            {dict.sections.viewAll} →
          </Link>
        </div>
        {allPosts.length > 0 ? (
          <div className={styles.blogGrid}>
            {allPosts.map((post) => (
              <PrefetchLink key={post.slug} href={`/${params.locale}/blog/${post.slug}`} className={styles.blogCard}>
                <div className={styles.blogMeta}>
                  <span className={styles.blogDate}>{post.date}</span>
                  <span className={styles.blogReadingTime}>
                    <FaClock style={{ fontSize: '0.7em' }} />
                    {post.readingTime} min
                  </span>
                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.blogTags}>
                      {post.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <h3 className={styles.blogTitle}>{post.title}</h3>
                <p className={styles.blogDescription}>{post.description}</p>
              </PrefetchLink>
            ))}
          </div>
        ) : (
          <div className={styles.blogEmpty}>
            <p>{dict.blog.empty}</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerIcons}>
          <a href="https://github.com/rusenbb" target="_blank" rel="noopener noreferrer" className={styles.footerIcon}>
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/rusenbirben" target="_blank" rel="noopener noreferrer" className={styles.footerIcon}>
            <FaLinkedin />
          </a>
          <a href="mailto:rusenbirben@gmail.com" className={styles.footerIcon}>
            <FaEnvelope />
          </a>
          <Link href={`/${params.locale}/feed.xml`} className={styles.footerIcon} title={dict.blog.rss}>
            <FaRss />
          </Link>
        </div>
        <div className={styles.footerContent}>
          <span>© {new Date().getFullYear()} {dict.hero.name}</span>
          <a href="https://rusenbirben.com" target="_blank" rel="noopener noreferrer" className={styles.footerPortfolio}>
            {dict.footer.visitPortfolio}
          </a>
        </div>
      </footer>
    </main>
  );
}
