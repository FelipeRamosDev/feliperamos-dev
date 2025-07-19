import SkillDetailsContent from '@/components/content/admin/skill/SkillDetailsContent/SkillDetailsContent';
import { AdminPageBase } from '@/components/layout';
import { parseAcceptLanguage } from '@/helpers';
import { SkillData } from '@/types/database.types';
import { headers } from 'next/headers';
import ajax from '@/hooks/useAjax';

export default async function SkillDetailsPage({ params }: { params: { skill_id: string } }) {
   const { skill_id } = await params;
   const headersList = await headers();
   const acceptLanguage = headersList.get('accept-language');
   const detectedLang = parseAcceptLanguage(acceptLanguage);

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
