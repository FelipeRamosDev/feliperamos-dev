import { CreateCurriculumContent } from "@/components/content/admin/curriculum";
import { AdminPageBase } from "@/components/layout";
import { headersAcceptLanguage } from "@/helpers";

export const metadata = {
   title: 'Create Curriculum',
   description: 'Create a new curriculum vitae.',
};

export default async function CurriculumCreatePage() {
   const detectedLocale = await headersAcceptLanguage();

   return (
      <AdminPageBase language={detectedLocale}>
         <CreateCurriculumContent />
      </AdminPageBase>
   );
}
