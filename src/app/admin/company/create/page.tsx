import CreateCompanyContent from '@/components/content/admin/company/CreateCompanyContent/CreateCompanyContent';
import { AdminPageBase } from '@/components/layout';
import { parseAcceptLanguage } from '@/helpers';
import { headers } from 'next/headers';

export default async function CreateCompanyPage() {
   const headersList = await headers();
   const acceptLanguage = headersList.get('accept-language');
   const detectedLang = parseAcceptLanguage(acceptLanguage);

   return (
      <AdminPageBase language={detectedLang}>
         <CreateCompanyContent />
      </AdminPageBase>
   );
}
