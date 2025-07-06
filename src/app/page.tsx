import { headers } from 'next/headers';
import HomePage from '@/components/content/HomeContent/HomeContent';
import { PageBase } from '@/components/layout';

export default async function Home() {
  const headersList = await headers();
  const language = headersList.get('accept-language')?.split(',')[0];

  return (
    <PageBase pageTitle="Home Page" language={language}>
      <HomePage />
    </PageBase>
  );
}
