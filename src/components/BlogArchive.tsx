'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaArrowLeft, FaRss } from 'react-icons/fa';
import { BlogPostMeta } from '@/lib/blog';
import { Dictionary, Locale } from '@/lib/i18n';
import { paginateItems } from '@/lib/pagination';
import { Pagination } from './Pagination';
import styles from '@/app/[locale]/blog/blog.module.css';

interface TagCount {
  tag: string;
  count: number;
}

interface BlogArchiveProps {
  locale: Locale;
  dict: Dictionary;
  tags: TagCount[];
  allPosts: BlogPostMeta[];
  postsPerPage: number;
}

function slugifyTag(tag: string): string {
  const turkishMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U',
  };

  return tag
    .toLowerCase()
    .split('')
    .map((char) => turkishMap[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function BlogArchive({
  locale,
  dict,
  tags,
  allPosts,
  postsPerPage,
}: BlogArchiveProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pagination = paginateItems(allPosts, currentPage, postsPerPage);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Link href={`/${locale}`} className={styles.backLink}>
            <FaArrowLeft />
            <span>{dict.blog.backToHome}</span>
          </Link>
          <Link href={`/${locale}/feed.xml`} className={styles.rssLink} title={dict.blog.rss}>
            <FaRss />
            <span>{dict.blog.rss}</span>
          </Link>
        </div>
        <h1 className={styles.title}>{dict.sections.blog}</h1>
        <p className={styles.subtitle}>{dict.blog.subtitle}</p>
      </div>

      {tags.length > 0 && (
        <div className={styles.tagFilters}>
          <span className={styles.filterLabel}>{dict.blog.filterByTag}:</span>
          <div className={styles.tagChips}>
            {tags.map(({ tag, count }) => (
              <Link key={tag} href={`/${locale}/tags/${slugifyTag(tag)}`} className={styles.tagChip}>
                {tag} <span className={styles.tagCount}>({count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {allPosts.length > 0 ? (
        <>
          <div className={styles.postsList}>
            {pagination.items.map((post) => (
              <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className={styles.postCard}>
                <div className={styles.postMeta}>
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
              </Link>
            ))}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            labels={dict.pagination}
          />
        </>
      ) : (
        <div className={styles.empty}>
          <p>{dict.blog.empty}</p>
        </div>
      )}
    </main>
  );
}
