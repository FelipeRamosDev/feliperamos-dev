import { PageBase } from '@/components/layout';
import { LoginContent } from '@/components/content/admin';
import { headersAcceptLanguage } from '@/helpers';
import { AuthProvider } from '@/services';

export const metadata = {
   title: 'Admin Login - Admin Dashboard',
   description: 'Login to the admin dashboard to manage your application',
};

export default async function LoginPage() {
   const detectedLang = await headersAcceptLanguage();

   return (
      <PageBase language={detectedLang}>
         <AuthProvider notAuthRender spinnerHeight="82vh">
            <LoginContent />
         </AuthProvider>
      </PageBase>
   );
}
