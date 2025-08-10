import { ErrorContent } from '@/components/content';
import { EducationDetailsContent } from '@/components/content/admin/education';
import { ErrorContentProps } from '@/components/content/ErrorContent/ErrorContent.types';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import ajax from '@/hooks/useAjax';
import { EducationData } from '@/types/database.types';

export default async function EducationDetailsPage({ params }: { params: Promise<{ education_id: string }> }) {
   const { education_id } = await params;
   const language = await headersAcceptLanguage();

   try {
      const education = await ajax.get<EducationData>(`/education/${education_id}`, { params: { language_set: language } });
      if (!education) {
         return <ErrorContent status={404} message="Education not found" />;
      }

      return (
         <AdminPageBase language={language}>
            <EducationDetailsContent education={education.data as EducationData} />
         </AdminPageBase>
      );
   } catch (error) {
      return <ErrorContent {...error as ErrorContentProps} />;
   }
}
