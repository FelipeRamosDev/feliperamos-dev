import { ErrorContent } from '@/components/content';
import LanguageDetailsContent from '@/components/content/admin/language/LanguageDetailsContent/LanguageDetailsContent';
import { ErrorContentProps } from '@/components/content/ErrorContent/ErrorContent.types';
import { AdminPageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { LanguageData } from '@/types/database.types';
import ajax from '@/hooks/useAjax';

export default async function LanguageDetailsPage({ params }: { params: Promise<{ language_id: string }> }) {
   const { language_id } = await params;
   const locale = await headersAcceptLanguage();

   try {
      const language = await ajax.get<LanguageData>(`/language/${language_id}`);

      if (!language.success) {
         return <ErrorContent {...language as ErrorContentProps} />;
      }

      return (
         <AdminPageBase language={locale}>
            <LanguageDetailsContent language={language.data as LanguageData} />
         </AdminPageBase>
      );
   } catch (error) {
      return <ErrorContent {...error as ErrorContentProps} />
   }
}
