import { AdminPageBase } from '@/components/layout';
import { parseAcceptLanguage } from '@/helpers';
import { CompanyData } from '@/types/database.types';
import { headers } from 'next/headers';
import { useAjax } from '@/hooks/useAjax';
import CompanyDetailsContent from '@/components/content/admin/company/CompanyDetailsContent/CompanyDetailsContent';

export default async function CompanyPage({ params }: { params: Promise<{ company_id: string }> }) {
   const { company_id } = await params;
   const headersList = await headers();
   const acceptLanguage = headersList.get('accept-language');
   const detectedLang = parseAcceptLanguage(acceptLanguage);
   const ajax = useAjax();

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
      console.error("Error fetching experience data:", error);
      return null;
   }
}
