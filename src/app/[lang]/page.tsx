import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomeContent } from "@/components/content";
import { PageBase } from "@/components/layout";
import metadataText from '@/resources/text/metadata.text';
import { allowedLanguages, defaultLanguage } from '@/app.config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  // Validate language
  if (!allowedLanguages.includes(lang)) {
    notFound();
  }

  metadataText.setLanguage(lang);

  return {
    title: metadataText.getText('metadata.title'),
    description: metadataText.getText('metadata.description'),
    keywords: metadataText.getText('metadata.keywords'),
    authors: [{ name: 'Felipe Ramos', url: 'https://github.com/FelipeRamosDev' }],
    creator: 'Felipe Ramos',
    alternates: {
      languages: {
        'x-default': '/',
        'en': '/',
        'pt': '/pt'
      }
    }
  };
}

export async function generateStaticParams() {
  // Generate static pages for all languages except default (since root handles default)
  return allowedLanguages
    .filter(lang => lang !== defaultLanguage)
    .map(lang => ({ lang }));
}

export const dynamicParams = false; // Disable dynamic params to use static generation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function LangPage({ params }: { 
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Validate language
  if (!allowedLanguages.includes(lang)) {
    notFound();
  }
  
  // Don't serve default language on this route (use root instead)
  if (lang === defaultLanguage) {
    notFound();
  }

  return (
    <PageBase language={lang}>
      <HomeContent language={lang} />
    </PageBase>
  );
}