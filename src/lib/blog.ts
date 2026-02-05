import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { Locale, locales } from './i18n';
import 'katex/dist/katex.min.css';

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
  series?: string;
  seriesOrder?: number;
  translationKey?: string;  // ← NEW: Links translations across languages
  content: string;
  headings: Heading[];
  readingTime: number;
}

export interface BlogPostMeta {
  slug: string;
  locale: Locale;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  series?: string;
  seriesOrder?: number;
  translationKey?: string;  // ← NEW
  readingTime: number;
}

export interface Series {
  name: string;
  posts: BlogPostMeta[];
}

// Translation mapping cache
let translationMap: Map<string, Map<Locale, string>> | null = null;

function getLocaleDirectory(locale: Locale): string {
  return path.join(contentDirectory, locale);
}

function ensureDirectoryExists(locale: Locale) {
  const dir = getLocaleDirectory(locale);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Build a map of translationKey -> {locale -> slug}
export function buildTranslationMap(): Map<string, Map<Locale, string>> {
  if (translationMap) return translationMap;
  
  translationMap = new Map();
  
  for (const locale of locales) {
    ensureDirectoryExists(locale);
    const postsDirectory = getLocaleDirectory(locale);
    
    if (!fs.existsSync(postsDirectory)) continue;
    
    const fileNames = fs.readdirSync(postsDirectory);
    
    for (const fileName of fileNames) {
      if (!fileName.endsWith('.md') && !fileName.endsWith('.mdx')) continue;
      
      const slug = fileName.replace(/\.(md|mdx)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      if (data.translationKey) {
        if (!translationMap.has(data.translationKey)) {
          translationMap.set(data.translationKey, new Map());
        }
        translationMap.get(data.translationKey)!.set(locale, slug);
      }
    }
  }
  
  return translationMap;
}

// Get the translation URL for a post when switching languages
export function getTranslatedPostUrl(
  currentLocale: Locale,
  targetLocale: Locale,
  currentSlug: string,
  translationKey?: string
): string | null {
  // If no translationKey, can't translate
  if (!translationKey) return null;
  
  const map = buildTranslationMap();
  const translations = map.get(translationKey);
  
  if (!translations) return null;
  
  // Get the slug for the target locale
  const targetSlug = translations.get(targetLocale);
  
  if (!targetSlug) return null;
  
  return `/${targetLocale}/blog/${targetSlug}/`;
}

// Get all available translations for a post
export function getPostTranslations(translationKey?: string): Map<Locale, string> | null {
  if (!translationKey) return null;
  
  const map = buildTranslationMap();
  return map.get(translationKey) || null;
}

export function getAllPosts(locale: Locale): BlogPostMeta[] {
  ensureDirectoryExists(locale);
  
  const postsDirectory = getLocaleDirectory(locale);
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        locale,
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags,
        series: data.series,
        seriesOrder: data.seriesOrder,
        translationKey: data.translationKey,  // ← NEW
        readingTime: calculateReadingTime(content),
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
  
  // Try .md first, then .mdx
  let fullPath = path.join(getLocaleDirectory(locale), `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(getLocaleDirectory(locale), `${slug}.mdx`);
  }
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Extract headings for table of contents
  const headings: Heading[] = [];
  
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(() => (tree: any) => {
      // Extract headings after slug is added (h1, h2, h3)
      visit(tree, 'element', (node: any) => {
        if (node.tagName === 'h1' || node.tagName === 'h2' || node.tagName === 'h3') {
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
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
  
  const contentHtml = processedContent.toString();

  return {
    slug,
    locale,
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags,
    series: data.series,
    seriesOrder: data.seriesOrder,
    translationKey: data.translationKey,  // ← NEW
    content: contentHtml,
    headings,
    readingTime: calculateReadingTime(content),
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
        .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
        .forEach((fileName) => {
          slugs.push({
            locale,
            slug: fileName.replace(/\.(md|mdx)$/, ''),
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

// Series/Collections functions
export function getAllSeries(locale: Locale): Series[] {
  const posts = getAllPosts(locale);
  const seriesMap = new Map<string, BlogPostMeta[]>();

  for (const post of posts) {
    if (post.series) {
      const existing = seriesMap.get(post.series) || [];
      existing.push(post);
      seriesMap.set(post.series, existing);
    }
  }

  // Sort posts within each series by seriesOrder
  seriesMap.forEach((seriesPosts, name) => {
    seriesPosts.sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
    seriesMap.set(name, seriesPosts);
  });

  return Array.from(seriesMap.entries())
    .map(([name, posts]) => ({ name, posts }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getPostsBySeries(locale: Locale, seriesName: string): BlogPostMeta[] {
  const posts = getAllPosts(locale);
  return posts
    .filter((post) => post.series === seriesName)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

export function getAllSeriesSlugs(locale: Locale): string[] {
  const series = getAllSeries(locale);
  return series.map((s) => s.name);
}
