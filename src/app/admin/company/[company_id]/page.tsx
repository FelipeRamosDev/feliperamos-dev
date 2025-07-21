import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { CompanyData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';
import CompanyDetailsContent from '@/components/content/admin/company/CompanyDetailsContent/CompanyDetailsContent';

export default async function CompanyPage({ params }: { params: Promise<{ company_id: string }> }) {
   const { company_id } = await params;
   const detectedLang = await headersAcceptLanguage();

   try {
      const { data, success, message } = await ajax.get<CompanyData>(`/company/${company_id}`);

      if (!success) {
         console.error("Error fetching company data:", message);
         return null;
      }

      return (
         <AdminPageBase language={detectedLang}>
            <CompanyDetailsContent company={data} />
         </AdminPageBase>
      );
   } catch (error) {
      console.error("Error fetching company data:", error);
      return null;
   }
}
