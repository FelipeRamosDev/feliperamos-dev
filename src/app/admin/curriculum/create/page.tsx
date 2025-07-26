import { CreateCurriculumContent } from "@/components/content/admin/curriculum";
import { AdminPageBase } from "@/components/layout";
import { headersAcceptLanguage } from "@/helpers";

export default async function CurriculumCreatePage() {
   const detectedLocale = await headersAcceptLanguage();

   return (
      <AdminPageBase language={detectedLocale}>
         <CreateCurriculumContent />
      </AdminPageBase>
   );
}
