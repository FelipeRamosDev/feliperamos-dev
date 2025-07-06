import { headers } from 'next/headers';
import HomePage from '@/components/content/HomeContent/HomeContent';
import { PageBase } from '@/components/layout';

export default async function Home({ searchParams }: { searchParams: Promise<{ lang: string }> }) {
  const headersList = await headers();
  const language = headersList.get('accept-language')?.split(',')[0];
  const urlParams = await searchParams;
  const lang = urlParams.lang || language;

  return (
    <PageBase language={lang}>
      <HomePage />
    </PageBase>
  );
}
