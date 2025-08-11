import { LanguageCreateContent } from '@/components/content/admin/language';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export const metadata = {
   title: 'Create Language',
   description: 'Create a new language entry',
};

export default async function LanguageCreatePage() {
   const locale = await headersAcceptLanguage();

   return (
      <AdminPageBase language={locale}>
         <LanguageCreateContent />
      </AdminPageBase>
   );
}
