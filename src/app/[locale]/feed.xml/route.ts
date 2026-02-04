import { getAllPosts } from '@/lib/blog';
import { Locale, getDictionary, locales } from '@/lib/i18n';

const SITE_URL = 'https://rusenbirben.com';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(request: Request, { params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const posts = getAllPosts(locale);

  const rssItems = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/${locale}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${locale}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags?.map((tag) => `<category>${tag}</category>`).join('\n      ') || ''}
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${dict.hero.name}</title>
    <link>${SITE_URL}/${locale}</link>
    <description>${dict.blog.subtitle}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/${locale}/feed.xml" rel="self" type="application/rss+xml"/>
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
