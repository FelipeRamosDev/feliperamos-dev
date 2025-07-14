import AdminPainelContent from '@/components/content/admin/DashboardContent/DashboardContent';
import { AdminPageBase } from '@/components/layout';
import { parseAcceptLanguage } from '@/helpers';
import { headers } from 'next/headers';


export default async function AdminDashboardPage() {
   const headersList = await headers();
   const acceptLanguage = headersList.get('accept-language');
   const detectedLang = parseAcceptLanguage(acceptLanguage);

   return (
      <AdminPageBase language={detectedLang}>
         <AdminPainelContent />
      </AdminPageBase>
   );
}
