import { ExperienceDetailsContent } from '@/components/content/admin/experience';
import { AdminPageBase } from '@/components/layout';
import { parseAcceptLanguage } from '@/helpers';
import { ExperienceData } from '@/types/database.types';
import { headers } from 'next/headers';
import ajax from '@/hooks/useAjax';

export default async function AdminExperiencePage({ params }: { params: { experience_id: string } }) {
   const { experience_id } = await params;
   const headersList = await headers();
   const acceptLanguage = headersList.get('accept-language');
   const detectedLang = parseAcceptLanguage(acceptLanguage);

   try {
      const { data, success, message } = await ajax.get<ExperienceData>(`/experience/${experience_id}`);

      if (!success) {
         console.error("Error fetching experience data:", message);
         return null;
      }

      return (
         <AdminPageBase language={detectedLang}>
            <ExperienceDetailsContent experience={data} />
         </AdminPageBase>
      );
   } catch (error) {
      console.error("Error fetching experience data:", error);
      return null;
   }
}
