import { CreateExperienceContent } from '@/components/content/admin/experience';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export const metadata = {
   title: 'Create Experience - Admin Dashboard',
   description: 'Create a new experience in the admin dashboard',
};

export default async function CreateExperiencePage() {
   const detectedLang = await headersAcceptLanguage();

   return (
      <AdminPageBase language={detectedLang}>
         <CreateExperienceContent />
      </AdminPageBase>
   );
}
