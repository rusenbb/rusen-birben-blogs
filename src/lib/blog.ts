import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Locale, defaultLocale, locales } from './i18n';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  locale: Locale;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  locale: Locale;
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

function getLocaleDirectory(locale: Locale): string {
  return path.join(contentDirectory, locale);
}

function ensureDirectoryExists(locale: Locale) {
  const dir = getLocaleDirectory(locale);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getAllPosts(locale: Locale): BlogPostMeta[] {
  ensureDirectoryExists(locale);
  
  const postsDirectory = getLocaleDirectory(locale);
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        locale,
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags,
      };
    });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getLatestPosts(locale: Locale, count: number): BlogPostMeta[] {
  const posts = getAllPosts(locale);
  return posts.slice(0, count);
}

export async function getPostBySlug(locale: Locale, slug: string): Promise<BlogPost | null> {
  ensureDirectoryExists(locale);
  
  const fullPath = path.join(getLocaleDirectory(locale), `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    locale,
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags,
    content: contentHtml,
  };
}

export function getAllPostSlugs(): { locale: Locale; slug: string }[] {
  const slugs: { locale: Locale; slug: string }[] = [];

  for (const locale of locales) {
    ensureDirectoryExists(locale);
    const postsDirectory = getLocaleDirectory(locale);
    
    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory);
      fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .forEach((fileName) => {
          slugs.push({
            locale,
            slug: fileName.replace(/\.md$/, ''),
          });
        });
    }
  }

  return slugs;
}
