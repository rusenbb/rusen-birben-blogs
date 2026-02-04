import { getAllPosts } from '@/lib/blog';
import { locales, defaultLocale } from '@/lib/i18n';

const SITE_URL = 'https://rusenbirben.com';

export async function GET() {
  // Combine posts from all locales, prioritizing default locale
  const allPosts = locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      ...post,
      url: `${SITE_URL}/${locale}/blog/${post.slug}`,
    }))
  );

  // Sort by date, newest first
  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const rssItems = allPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.url}</link>
      <guid isPermaLink="true">${post.url}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags?.map((tag) => `<category>${tag}</category>`).join('\n      ') || ''}
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rusen's Blog</title>
    <link>${SITE_URL}</link>
    <description>Thoughts on AI, engineering, philosophy, and more.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
