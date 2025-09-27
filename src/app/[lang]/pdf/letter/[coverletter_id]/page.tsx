import { ErrorContent } from '@/components/content';
import { LetterPDFContent } from '@/components/content/pdf/letter';
import { PageBase } from '@/components/layout';
import { headersAcceptLanguage } from '@/helpers';
import { getLetter } from '@/helpers/database.helpers';
import ajax from '@/hooks/useAjax';

export default async function CoverLetterPDFPage({ params }: { params: Promise<{ coverletter_id: string }> }) {
   const language = await headersAcceptLanguage();
   const { coverletter_id } = await params;

   try {
      const letter = await getLetter(ajax, Number(coverletter_id));
   
      return (
         <PageBase
            language={language}
            fullwidth
            hideFooter
            hideHeader
            data-language={String(language)}
         >
            <LetterPDFContent letter={letter} />
         </PageBase>
      );
   } catch (error) {
      console.error('Error fetching cover letter:', error);
      return <ErrorContent {...error as ErrorCallback} />;
   }
}
