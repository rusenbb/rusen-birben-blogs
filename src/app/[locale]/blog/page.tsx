import { BlogArchive } from '@/components/BlogArchive';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';

interface Props {
  params: { locale: Locale };
}

const BLOGS_PER_PAGE = 20;

export async function generateMetadata({ params }: Props) {
  const dict = getDictionary(params.locale);

  return {
    title: `${dict.sections.blog} | ${dict.hero.name}`,
    description: dict.blog.subtitle,
  };
}

export default function BlogPage({ params }: Props) {
  const dict = getDictionary(params.locale);
  const posts = getAllPosts(params.locale);
  const tags = getAllTags(params.locale);

  return (
    <BlogArchive
      locale={params.locale}
      dict={dict}
      tags={tags}
      allPosts={posts}
      postsPerPage={BLOGS_PER_PAGE}
    />
  );
}
