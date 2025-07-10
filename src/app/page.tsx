import { Metadata } from 'next';
import { headers } from 'next/headers';
import { parseAcceptLanguage } from '@/helpers';
import HomePage from '@/components/content/HomeContent/HomeContent';
import { PageBase } from '@/components/layout';
import metadataText from '@/resources/text/metadata.text';
import { defaultLanguage } from '@/app.config';

export async function generateMetadata(): Promise<Metadata> {
  // Use default language for root page metadata (for SEO consistency)
  metadataText.setLanguage(defaultLanguage);

  return {
    title: metadataText.getText('metadata.title'),
    description: metadataText.getText('metadata.description'),
    keywords: metadataText.getText('metadata.keywords'),
    authors: [{ name: 'Felipe Ramos', url: 'https://github.com/FelipeRamosDev' }],
    creator: 'Felipe Ramos',
    alternates: {
      languages: {
        'en': '/',
        'pt': '/pt'
      }
    }
  };
}

export default async function Home() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const detectedLang = parseAcceptLanguage(acceptLanguage);

  return (
    <PageBase language={detectedLang}>
      <HomePage />
    </PageBase>
  );
}
