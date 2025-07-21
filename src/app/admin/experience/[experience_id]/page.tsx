import { ExperienceDetailsContent } from '@/components/content/admin/experience';
import { AdminPageBase, PageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { ExperienceData } from '@/types/database.types';
import { ErrorContent } from '@/components/content';
import ajax from '@/hooks/useAjax';
import { AjaxResponseError } from '@/services/Ajax/Ajax.types';

export const metadata = {
   title: 'Experience Details - Admin Dashboard',
   description: 'View and manage experience details in the admin dashboard',
};

export default async function AdminExperiencePage({ params }: { params: Promise<{ experience_id: string }> }) {
   const { experience_id } = await params;
   const detectedLang = await headersAcceptLanguage();

   try {
      const response = await ajax.get<ExperienceData>(`/experience/${experience_id}`);
      const { data, success } = response;

      if (!success) {
         throw response;
      }

      return (
         <AdminPageBase language={detectedLang}>
            <ExperienceDetailsContent experience={data} />
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
