import { SkillDetailsContent } from '@/components/content/admin/skill';
import { AdminPageBase } from '@/components/layout';
import { SkillData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';
import { headersAcceptLanguage } from '@/helpers';

export const metadata = {
   title: 'Skill Details - Admin Dashboard',
   description: 'View and manage skill details in the admin dashboard',
};

export default async function SkillDetailsPage({ params }: { params: Promise<{ skill_id: string }> }): Promise<React.ReactElement | null> {
   const { skill_id } = await params;
   const detectedLang = await headersAcceptLanguage();

   try {
      const { data, success, message } = await ajax.get<SkillData>(`/skill/${skill_id}`);

      if (!success) {
         console.error("Error fetching skill data:", message);
         return null;
      }

      return (
         <AdminPageBase language={detectedLang}>
            <SkillDetailsContent skill={data} />
         </AdminPageBase>
      );
   } catch (error) {
      console.error("Error fetching skill data:", error);
      return null;
   }
}
