import { headers } from 'next/headers';
import { PageBase } from '@/components/layout';
import { LoginContent } from '@/components/content/admin';
import { parseAcceptLanguage } from '@/helpers';
import { AuthProvider } from '@/services';

export default async function LoginPage() {
   const headersList = await headers();
   const acceptLanguage = headersList.get('accept-language');
   const detectedLang = parseAcceptLanguage(acceptLanguage);

   return (
      <PageBase language={detectedLang}>
         <AuthProvider notAuthRender spinnerHeight="82vh">
            <LoginContent />
         </AuthProvider>
      </PageBase>
   );
}
