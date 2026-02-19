import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostForOG {
  translationKey: string;
  title: string;
  slug: string;
}

const contentDir = path.join(process.cwd(), 'content/blog');
const locales = ['en', 'tr'] as const;

export function collectPostsForOG(): PostForOG[] {
  const seen = new Map<string, PostForOG>();

  for (const locale of locales) {
    const dir = path.join(contentDir, locale);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

      const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      const slug = file.replace(/\.(md|mdx)$/, '');
      const key = data.translationKey || `${locale}-${slug}`;

      // Prefer first seen (EN processed first)
      if (!seen.has(key)) {
        seen.set(key, {
          translationKey: key,
          title: data.title,
          slug,
        });
      }
    }
  }

  return Array.from(seen.values());
}
