import { ErrorContent } from '@/components/content';
import { EducationDetailsContent } from '@/components/content/admin/education';
import { ErrorContentProps } from '@/components/content/ErrorContent/ErrorContent.types';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import ajax from '@/hooks/useAjax';
import { EducationData } from '@/types/database.types';
import { cache } from 'react';

const loadEducation = cache(async (education_id: string, language_set: string) => {
   const response = await ajax.get<EducationData>(`/education/${education_id}`, { params: { language_set } });
   return response;
});

export async function generateMetadata({ params }: { params: Promise<{ education_id: string }> }) {
   const { education_id } = await params;
   const language = await headersAcceptLanguage();
   const response = await loadEducation(education_id, language);

   const education = response.data as EducationData;
   const languageSet = education.languageSets?.find(ls => ls.language_set === language);

   return {
      title: `${education.institution_name} (${languageSet?.field_of_study}) - Education Details`,
      description: `Details of the education entry with ID ${education_id} - ${languageSet?.description}`,
      language,
   };
}

export default async function EducationDetailsPage({ params }: { params: Promise<{ education_id: string }> }) {
   const { education_id } = await params;
   const language = await headersAcceptLanguage();
   const response = await loadEducation(education_id, language);

   if (response.error) {
      return <ErrorContent {...response} />;
   }

   try {
      return (
         <AdminPageBase language={language}>
            <EducationDetailsContent education={response.data as EducationData} />
         </AdminPageBase>
      );
   } catch (error) {
      return <ErrorContent {...error as ErrorContentProps} />;
   }
}
