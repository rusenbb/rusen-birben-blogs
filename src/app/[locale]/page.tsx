import styles from './page.module.css';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope, FaPen, FaArrowRight, FaRss, FaExternalLinkAlt } from 'react-icons/fa';
import { Locale, getDictionary } from '@/lib/i18n';
import { getAllPosts, getAllTags } from '@/lib/blog';

interface Props {
  params: { locale: Locale };
}

export default function Home({ params }: Props) {
  const dict = getDictionary(params.locale);
  const allPosts = getAllPosts(params.locale);
  const allTags = getAllTags(params.locale);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.greeting}>{dict.hero.greeting}</p>
          <h1 className={styles.name}>{dict.hero.name}</h1>
          <p className={styles.title}>{dict.hero.title}</p>
          <p className={styles.bio}>{dict.hero.bio}</p>
          <div className={styles.heroLinks}>
            <a href="https://github.com/rusenbb" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/rusenbirben" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
              <FaLinkedin />
            </a>
            <a href="mailto:rusenbirben@gmail.com" className={styles.iconLink}>
              <FaEnvelope />
            </a>
            <Link href={`/${params.locale}/feed.xml`} className={styles.iconLink} title={dict.blog.rss}>
              <FaRss />
            </Link>
          </div>
        </div>
      </section>

      {/* Tags Section */}
      {allTags.length > 0 && (
        <section className={styles.section} id="tags">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{dict.sections.tags}</h2>
            <Link href={`/${params.locale}/tags`} className={styles.viewAllLink}>
              {dict.sections.viewAll} <FaArrowRight />
            </Link>
          </div>
          <div className={styles.tagsContainer}>
            {allTags.slice(0, 8).map(({ tag, count }) => (
              <Link key={tag} href={`/${params.locale}/tags/${encodeURIComponent(tag)}`} className={styles.tagChip}>
                {tag} <span className={styles.tagCount}>({count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Blog Section */}
      <section className={styles.section} id="blog">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{dict.sections.blog}</h2>
        </div>
        {allPosts.length > 0 ? (
          <div className={styles.blogGrid}>
            {allPosts.map((post) => (
              <Link key={post.slug} href={`/${params.locale}/blog/${post.slug}`} className={styles.blogCard}>
                <div className={styles.blogHeader}>
                  <FaPen className={styles.blogIcon} />
                  <span className={styles.blogDate}>{post.date}</span>
                </div>
                <h3 className={styles.blogTitle}>{post.title}</h3>
                <p className={styles.blogDescription}>{post.description}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className={styles.blogTags}>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.blogEmpty}>
            <FaPen className={styles.blogEmptyIcon} />
            <p>{dict.blog.empty}</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="https://github.com/rusenbb" target="_blank" rel="noopener noreferrer">
            <FaGithub /> GitHub
          </a>
          <a href="https://linkedin.com/in/rusenbirben" target="_blank" rel="noopener noreferrer">
            <FaLinkedin /> LinkedIn
          </a>
          <a href="mailto:rusenbirben@gmail.com">
            <FaEnvelope /> Email
          </a>
          <a href="https://rusen.ai" target="_blank" rel="noopener noreferrer">
            <FaExternalLinkAlt /> {dict.footer.visitPortfolio}
          </a>
        </div>
        <p className={styles.copyright}>&copy; {new Date().getFullYear()} {dict.footer.copyright}</p>
      </footer>
    </main>
  );
}
