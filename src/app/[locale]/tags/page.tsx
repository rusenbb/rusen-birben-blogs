import { getAllTags } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';
import styles from './tags.module.css';
import Link from 'next/link';
import { FaArrowLeft, FaTag } from 'react-icons/fa';

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
    title: `${dict.tags.title} | ${dict.hero.name}`,
    description: dict.tags.subtitle,
  };
}

export default function TagsPage({ params }: Props) {
  const dict = getDictionary(params.locale);
  const tags = getAllTags(params.locale);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <Link href={`/${params.locale}`} className={styles.backLink}>
          <FaArrowLeft />
          <span>{dict.blog.backToHome}</span>
        </Link>
        <h1 className={styles.title}>{dict.tags.title}</h1>
        <p className={styles.subtitle}>{dict.tags.subtitle}</p>
      </div>

      {tags.length > 0 ? (
        <div className={styles.tagsGrid}>
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/${params.locale}/tags/${slugifyTag(tag)}`}
              className={styles.tagCard}
            >
              <FaTag className={styles.tagIcon} />
              <span className={styles.tagName}>{tag}</span>
              <span className={styles.tagCount}>
                {count} {dict.tags.postsCount}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <FaTag className={styles.emptyIcon} />
          <p>{dict.tags.noTags}</p>
        </div>
      )}
    </main>
  );
}
