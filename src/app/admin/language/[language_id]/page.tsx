import { ErrorContent } from '@/components/content';
import LanguageDetailsContent from '@/components/content/admin/language/LanguageDetailsContent/LanguageDetailsContent';
import { ErrorContentProps } from '@/components/content/ErrorContent/ErrorContent.types';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { LanguageData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';

let language: LanguageData | null = null;

export async function generateMetadata({ params }: { params: Promise<{ language_id: string }> }) {
   const locale = await headersAcceptLanguage();
   const { language_id } = await params;

   const response = await ajax.get<LanguageData>(`/language/${language_id}`, { params: { language_set: locale } });
   language = response.data as LanguageData;

   if (!response.success) {
      return <ErrorContent {...language as ErrorContentProps} />;
   }

   return {
      title: `${language.default_name} - Language Details`,
      description: `Details of the language entry ${language.default_name} - ${language.proficiency}`,
      language: locale,
   };
}

export default async function LanguageDetailsPage() {
   const locale = await headersAcceptLanguage();

   return (
      <AdminPageBase language={locale}>
         <LanguageDetailsContent language={language as LanguageData} />
      </AdminPageBase>
   );
}
