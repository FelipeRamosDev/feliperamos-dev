import { ErrorContent } from '@/components/content';
import { EducationDetailsContent } from '@/components/content/admin/education';
import { ErrorContentProps } from '@/components/content/ErrorContent/ErrorContent.types';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import ajax from '@/hooks/useAjax';
import { EducationData } from '@/types/database.types';

let education: EducationData | null = null;

export async function generateMetadata({ params }: { params: Promise<{ education_id: string }> }) {
   const { education_id } = await params;
   const language = await headersAcceptLanguage();
   const response = await ajax.get<EducationData>(`/education/${education_id}`, { params: { language_set: language } });
   education = response.data as EducationData;
   const languageSet = education.languageSets?.find(ls => ls.language_set === language);

   return {
      title: `${education.institution_name} (${languageSet?.field_of_study}) - Education Details`,
      description: `Details of the education entry with ID ${education_id} - ${languageSet?.description}`,
      language,
   };
}

export default async function EducationDetailsPage() {
   const language = await headersAcceptLanguage();

   if (!education) {
      return <ErrorContent status={404} message="Education not found" />;
   }

   try {
      return (
         <AdminPageBase language={language}>
            <EducationDetailsContent education={education as EducationData} />
         </AdminPageBase>
      );
   } catch (error) {
      return <ErrorContent {...error as ErrorContentProps} />;
   }
}
