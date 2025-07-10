import { headers } from 'next/headers';
import { PageBase } from '@/components/layout';
import { LoginContent } from '@/components/content/admin';
import { parseAcceptLanguage } from '@/helpers';

export default async function LoginPage() {
   const headersList = await headers();
   const acceptLanguage = headersList.get('accept-language');
   const detectedLang = parseAcceptLanguage(acceptLanguage);

   return (
      <PageBase language={detectedLang}>
         <LoginContent />
      </PageBase>
   );
}
