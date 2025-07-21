import { AdminPageBase, PageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { CompanyData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';
import { CompanyDetailsContent } from '@/components/content/admin/company';
import { ErrorContent } from '@/components/content';
import { AjaxResponseError } from '@/services/Ajax/Ajax.types';

export const metadata = {
   title: 'Company Details - Admin Dashboard',
   description: 'View and manage company details in the admin dashboard',
};

export default async function CompanyPage({ params }: { params: Promise<{ company_id: string }> }) {
   const { company_id } = await params;
   const detectedLang = await headersAcceptLanguage();

   try {
      const response = await ajax.get<CompanyData>(`/company/${company_id}`);
      const { data, success } = response;

      if (!success) {
         throw response;
      }

      return (
         <AdminPageBase language={detectedLang}>
            <CompanyDetailsContent company={data} />
         </AdminPageBase>
      );
   } catch (error) {
      return (
         <PageBase language={detectedLang}>
            <ErrorContent {...error as AjaxResponseError} />
         </PageBase>
      );
   }
}
