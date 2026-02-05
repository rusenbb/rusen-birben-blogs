import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { locales } from '@/lib/i18n';
import { siteConfig } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];
  
  // Add home pages for each locale
  for (const locale of locales) {
    routes.push({
      url: `${siteConfig.url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });
    
    // Add tags page
    routes.push({
      url: `${siteConfig.url}/${locale}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
    
    // Add blog index page
    routes.push({
      url: `${siteConfig.url}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
    
    // Add all blog posts
    const posts = getAllPosts(locale);
    for (const post of posts) {
      routes.push({
        url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }
  
  return routes;
}
