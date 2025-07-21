import AdminPainelContent from '@/components/content/admin/DashboardContent/DashboardContent';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export default async function AdminDashboardPage() {
   const detectedLang = await headersAcceptLanguage();

   return (
      <AdminPageBase language={detectedLang}>
         <AdminPainelContent />
      </AdminPageBase>
   );
}
