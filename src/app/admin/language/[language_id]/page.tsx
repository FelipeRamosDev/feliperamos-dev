import { cache } from 'react';
import { ErrorContent } from '@/components/content';
import LanguageDetailsContent from '@/components/content/admin/language/LanguageDetailsContent/LanguageDetailsContent';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { LanguageData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';
import { AjaxResponse } from '@/services';
import { AjaxResponseError } from '@/services/Ajax/Ajax.types';

const getLanguage = cache(async (id: string, locale: string): Promise<AjaxResponse | AjaxResponseError> => {
   const res = await ajax.get<LanguageData>(`/language/${id}`, { params: { language_set: locale } });
   return res;
});

export async function generateMetadata({ params }: { params: Promise<{ language_id: string }> }) {
   const locale = await headersAcceptLanguage();
   const { language_id } = await params;

   const lang = await getLanguage(language_id, locale);
   const language = lang.data as LanguageData;

   if (!lang.success) {
      return <ErrorContent {...lang} />;
   }

   return {
      title: `${language.default_name} - Language Details`,
      description: `Details of the language entry ${language.default_name} - ${language.proficiency}`,
      language: locale,
   };
}

export default async function LanguageDetailsPage({ params }: { params: Promise<{ language_id: string }> }) {
   const locale = await headersAcceptLanguage();
   const { language_id } = await params;
   const language = await getLanguage(language_id, locale);

   return (
      <AdminPageBase language={locale}>
         <LanguageDetailsContent language={language.data as LanguageData} />
      </AdminPageBase>
   );
}
