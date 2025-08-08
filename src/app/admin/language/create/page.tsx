import LanguageCreateContent from "@/components/content/admin/language/LanguageCreateContent/LanguageCreateContent";
import { AdminPageBase } from "@/components/layout";
import { headersAcceptLanguage } from "@/helpers";

export default async function LanguageCreatePage() {
   const locale = await headersAcceptLanguage();

   return (
      <AdminPageBase language={locale}>
         <LanguageCreateContent />
      </AdminPageBase>
   );
}
