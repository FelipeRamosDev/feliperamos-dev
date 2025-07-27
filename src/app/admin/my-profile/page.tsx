import MyProfileContent from '@/components/content/admin/MyProfileContent/MyProfileContent';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export default async function MyProfilePage() {
   const language = await headersAcceptLanguage();

   return (
      <AdminPageBase language={language}>
         <MyProfileContent />
      </AdminPageBase>
   );
}
