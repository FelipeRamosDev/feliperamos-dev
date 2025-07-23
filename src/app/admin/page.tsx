import { DashboardContent } from '@/components/content/admin';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export const metadata = {
   title: 'Admin Dashboard - Manage your application dashboard',
   description: 'Admin Dashboard - Manage your application',
};

export default async function AdminDashboardPage() {
   const detectedLang = await headersAcceptLanguage();

   return (
      <AdminPageBase language={detectedLang}>
         <DashboardContent />
      </AdminPageBase>
   );
}
