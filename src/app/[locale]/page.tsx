import { HomeContent } from '@/components/HomeContent';
import { getAllPosts, getAllSeries, getAllTags } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';

interface Props {
  params: { locale: Locale };
}

export default function Home({ params }: Props) {
  const dict = getDictionary(params.locale);
  const allPosts = getAllPosts(params.locale);
  const allTags = getAllTags(params.locale);
  const allSeries = getAllSeries(params.locale);

  return (
    <HomeContent
      locale={params.locale}
      dict={dict}
      allPosts={allPosts}
      allSeries={allSeries}
      allTags={allTags}
    />
  );
}
