import { ErrorContent } from '@/components/content';
import { CVPDFTemplateContent } from '@/components/content/curriculum';
import { ErrorContentProps } from '@/components/content/ErrorContent/ErrorContent.types';
import { CVPDFTemplate } from '@/components/layout';
import ajax from '@/hooks/useAjax';
import { CVData } from '@/types/database.types';

export default async function CurriculumPdfPage({ params }: { params: Promise<{ pdf_cv_id: string, lang: string }> }) {
   const { lang, pdf_cv_id } = await params;

   if (isNaN(Number(pdf_cv_id))) {
      return <ErrorContent message="Invalid CV ID" code="INVALID_CV_ID" />;
   }

   try {
      const response = await ajax.get<CVData>(`/curriculum/public/${pdf_cv_id}`, { params: { language_set: lang } });

      if (!response.success) {
         throw response;
      }

      return (
         <CVPDFTemplate language={lang}>
            <CVPDFTemplateContent cv={response.data} />
         </CVPDFTemplate>
      );
   } catch (error) {
      return <ErrorContent {...(error as ErrorContentProps)} />;
   }
}
