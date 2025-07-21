import { CreateExperienceContent } from '@/components/content/admin/experience';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export default async function CreateExperiencePage() {
   const detectedLang = await headersAcceptLanguage();

   return (
      <AdminPageBase language={detectedLang}>
         <CreateExperienceContent />
      </AdminPageBase>
   );
}
