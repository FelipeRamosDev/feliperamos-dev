import { SkillDetailsContent } from '@/components/content/admin/skill';
import { AdminPageBase, PageBase } from '@/components/layout';
import { SkillData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';
import { headersAcceptLanguage } from '@/helpers';
import { ErrorContent } from '@/components/content';
import { AjaxResponseError } from '@/services/Ajax/Ajax.types';

export const metadata = {
   title: 'Skill Details - Admin Dashboard',
   description: 'View and manage skill details in the admin dashboard',
};

export default async function SkillDetailsPage({ params }: { params: Promise<{ skill_id: string }> }): Promise<React.ReactElement | null> {
   const { skill_id } = await params;
   const detectedLang = await headersAcceptLanguage();

   try {
      const response = await ajax.get<SkillData>(`/skill/${skill_id}`);
      const { data, success } = response;

      if (!success) {
         throw response;
      }

      return (
         <AdminPageBase language={detectedLang}>
            <SkillDetailsContent skill={data} />
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
