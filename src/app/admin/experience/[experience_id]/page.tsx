import { ExperienceDetailsContent } from '@/components/content/admin/experience';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { ExperienceData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';

export const metadata = {
   title: 'Experience Details - Admin Dashboard',
   description: 'View and manage experience details in the admin dashboard',
};

export default async function AdminExperiencePage({ params }: { params: Promise<{ experience_id: string }> }) {
   const { experience_id } = await params;
   const detectedLang = await headersAcceptLanguage();

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
