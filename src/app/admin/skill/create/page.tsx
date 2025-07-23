import { CreateSkillContent } from '@/components/content/admin/skill';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export const metadata = {
   title: 'Create Skill - Admin Dashboard',
   description: 'Create a new skill in the admin dashboard',
};

export default async function CreateSkillPage() {
   const detectedLang = await headersAcceptLanguage();

   return (
      <AdminPageBase language={detectedLang}>
         <CreateSkillContent />
      </AdminPageBase>
   );
}
