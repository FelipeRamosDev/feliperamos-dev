import { headers } from 'next/headers';
import HomePage from '@/components/content/HomeContent/HomeContent';
import { PageBase } from '@/components/layout';
import { Metadata } from 'next';
import metadataText from '@/resources/text/metadata.text';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang: string }> }): Promise<Metadata> {
  const headersList = await headers();
  const language = headersList.get('accept-language')?.split(',')[0];
  const urlParams = await searchParams;
  const lang = urlParams.lang || language;

  metadataText.setLanguage(lang);

  return {
    title: metadataText.getText('metadata.title'),
    description: metadataText.getText('metadata.description'),
    keywords: metadataText.getText('metadata.keywords'),
    authors: [{ name: 'Felipe Ramos', url: 'https://github.com/FelipeRamosDev' }],
    creator: 'Felipe Ramos'
  };
}

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
