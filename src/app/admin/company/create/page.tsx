import { CreateCompanyContent } from '@/components/content/admin/company';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export const metadata = {
   title: 'Create Company - Admin Dashboard',
   description: 'Create a new company in the admin dashboard',
};

export default async function CreateCompanyPage() {
   const detectedLang = await headersAcceptLanguage();

   return (
      <AdminPageBase language={detectedLang}>
         <CreateCompanyContent />
      </AdminPageBase>
   );
}
