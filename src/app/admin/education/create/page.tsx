import { EducationCreateContent } from '@/components/content/admin/education';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export const metadata = {
   title: 'Create Education',
   description: 'Create a new education entry',
};

export default async function EducationCreatePage() {
   const language = await headersAcceptLanguage();

   return (
      <AdminPageBase language={language}>
         <EducationCreateContent />
      </AdminPageBase>
   );
}
