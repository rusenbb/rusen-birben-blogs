import { SeriesArchive } from '@/components/SeriesArchive';
import { getAllSeries } from '@/lib/blog';
import { Locale, getDictionary } from '@/lib/i18n';

interface Props {
  params: { locale: Locale };
}

const SERIES_PER_PAGE = 10;

export async function generateMetadata({ params }: Props) {
  const dict = getDictionary(params.locale);

  return {
    title: `${dict.series.title} | ${dict.hero.name}`,
    description: dict.series.subtitle,
  };
}

export default function SeriesPage({ params }: Props) {
  const dict = getDictionary(params.locale);
  const allSeries = getAllSeries(params.locale);

  return (
    <SeriesArchive
      locale={params.locale}
      dict={dict}
      allSeries={allSeries}
      seriesPerPage={SERIES_PER_PAGE}
    />
  );
}
