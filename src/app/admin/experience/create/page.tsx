import { CreateExperienceContent } from '@/components/content/admin/experience';
import { AdminPageBase } from '@/components/layout';
import { parseAcceptLanguage } from '@/helpers';
import { headers } from 'next/headers';

export default async function CreateExperiencePage() {
   const headersList = await headers();
   const acceptLanguage = headersList.get('accept-language');
   const detectedLang = parseAcceptLanguage(acceptLanguage);
   
   return (
      <AdminPageBase language={detectedLang}>
         <CreateExperienceContent />
      </AdminPageBase>
   );
}
