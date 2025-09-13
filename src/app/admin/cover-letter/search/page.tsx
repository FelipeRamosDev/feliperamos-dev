import { CoverLetterSearch } from '@/components/content/admin/cover-letter';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export default async function CoverLetterSearchPage() {
   const locale = await headersAcceptLanguage();

   return (
      <AdminPageBase language={locale}>
         <CoverLetterSearch />
      </AdminPageBase>
   );
}
