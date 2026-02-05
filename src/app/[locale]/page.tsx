import styles from './page.module.css';
import Link from 'next/link';
import { PrefetchLink } from '@/components/PrefetchLink';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaRss, FaClock } from 'react-icons/fa';
import { Locale, getDictionary } from '@/lib/i18n';
import { getAllPosts, getAllTags } from '@/lib/blog';

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

export default function Home({ params }: Props) {
  const dict = getDictionary(params.locale);
  const allPosts = getAllPosts(params.locale);
  const allTags = getAllTags(params.locale);

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.name}>{dict.hero.name}</h1>
          <p className={styles.title}>{dict.hero.title}</p>
        </div>
        <div className={styles.headerRight}>
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
      </header>

      {/* About */}
      <section className={styles.about}>
        <div className={styles.aboutText}>
          <p>{dict.hero.bio}</p>
        </div>
      </section>

      {/* Tags Section */}
      {allTags.length > 0 && (
        <section className={styles.section} id="tags">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{dict.sections.tags}</h2>
            <Link href={`/${params.locale}/tags`} className={styles.viewAllLink}>
              {dict.sections.viewAll} →
            </Link>
          </div>
          <div className={styles.tagsContainer}>
            {allTags.slice(0, 8).map(({ tag, count }) => (
              <PrefetchLink key={tag} href={`/${params.locale}/tags/${slugifyTag(tag)}`} className={styles.tagChip}>
                {tag} <span className={styles.tagCount}>({count})</span>
              </PrefetchLink>
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
        <div className={styles.footerContent}>
          <span>© {new Date().getFullYear()} {dict.hero.name}</span>
          <div className={styles.footerLinks}>
            <a href="https://rusen.ai" target="_blank" rel="noopener noreferrer">
              {dict.footer.visitPortfolio}
            </a>
            <a href={`/${params.locale}/feed.xml`}>
              RSS
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
