import { OpportunitySearch } from '@/components/content/admin/opportunity';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';

export default async function OpportunitySearchPage() {
   const locale = await headersAcceptLanguage();

   return (
      <AdminPageBase language={locale}>
         <OpportunitySearch />
      </AdminPageBase>
   );
}
