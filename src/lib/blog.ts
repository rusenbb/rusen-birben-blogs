import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';
import { Locale, defaultLocale, locales } from './i18n';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface BlogPost {
  slug: string;
  locale: Locale;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  content: string;
  headings: Heading[];
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

  // Extract headings for table of contents
  const headings: Heading[] = [];
  
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(() => (tree: any) => {
      // Extract headings after slug is added
      visit(tree, 'element', (node: any) => {
        if (node.tagName === 'h2' || node.tagName === 'h3') {
          const level = parseInt(node.tagName[1]);
          const text = node.children
            ?.filter((child: any) => child.type === 'text')
            .map((child: any) => child.value)
            .join('') || '';
          const id = node.properties?.id || '';
          
          if (text && id) {
            headings.push({ level, text, id });
          }
        }
      });
    })
    .use(rehypeHighlight)
    .use(rehypeStringify)
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
    headings,
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

export function getAllTags(locale: Locale): { tag: string; count: number }[] {
  const posts = getAllPosts(locale);
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    if (post.tags) {
      for (const tag of post.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(locale: Locale, tag: string): BlogPostMeta[] {
  const posts = getAllPosts(locale);
  return posts.filter((post) => post.tags?.includes(tag));
}

export function getAllTagSlugs(): { locale: Locale; tag: string }[] {
  const tagSlugs: { locale: Locale; tag: string }[] = [];

  for (const locale of locales) {
    const tags = getAllTags(locale);
    for (const { tag } of tags) {
      tagSlugs.push({ locale, tag });
    }
  }

  return tagSlugs;
}
