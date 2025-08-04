import { CVDetailsContent } from '@/components/content/admin/curriculum';
import { AdminPageBase, PageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { CVData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';
import { ErrorContent } from '@/components/content';
import { AjaxResponseError } from '@/services/Ajax/Ajax.types';

export async function generateMetadata({ params }: { params: Promise<{ cv_id: string, lang: string }> }) {
   const { lang, cv_id } = await params;
   if (isNaN(Number(cv_id))) {
      throw new Error('Invalid CV ID');
   }

   try {
      const response = await ajax.get<CVData>(`/curriculum/public/${cv_id}`, { params: { language_set: lang } });

      if (!response.success) {
         throw response;
      }

      const cv = response.data;
      return {
         title: `Curriculum Vitae - ${cv.title}`,
         description: cv.summary || 'No summary available.',
      };
   } catch (error) {
      throw error;
   }
}

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
