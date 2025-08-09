import { EducationCreateContent } from '@/components/content/admin/education';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export default async function EducationCreatePage() {
   const language = await headersAcceptLanguage();

   return (
      <AdminPageBase language={language}>
         <EducationCreateContent />
      </AdminPageBase>
   );
}
