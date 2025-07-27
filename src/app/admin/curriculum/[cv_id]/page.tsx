import { CVDetailsContent } from '@/components/content/admin/curriculum';
import { AdminPageBase, PageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { CVData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';
import { ErrorContent } from '@/components/content';
import { AjaxResponseError } from '@/services/Ajax/Ajax.types';

export default async function CurriculumDetailsPage({ params }: { params: Promise<{ cv_id: string }> }) {
   const detectedLang = await headersAcceptLanguage();
   const { cv_id } = await params;

   try {
      const response = await ajax.get<CVData>(`/curriculum/${cv_id}`);
      const { data, success } = response;

      if (!success) {
         throw response;
      }

      return (
         <AdminPageBase language={detectedLang}>
            <CVDetailsContent cv={data} />
         </AdminPageBase>
      );
   } catch (error) {
      return (
         <PageBase language={detectedLang}>
            <ErrorContent {...error as AjaxResponseError} />
         </PageBase>
      );
   }
}
