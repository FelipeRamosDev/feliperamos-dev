import CreateCompanyContent from '@/components/content/admin/company/CreateCompanyContent/CreateCompanyContent';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export default async function CreateCompanyPage() {
   const detectedLang = await headersAcceptLanguage();

   return (
      <AdminPageBase language={detectedLang}>
         <CreateCompanyContent />
      </AdminPageBase>
   );
}
