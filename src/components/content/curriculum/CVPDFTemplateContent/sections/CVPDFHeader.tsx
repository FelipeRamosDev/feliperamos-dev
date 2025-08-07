import Link from 'next/link';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from '../CVPDFTemplateContent.module.scss';
import { Container, Markdown } from '@/components/common';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVPDFTemplateContext.text';

export default function CVPDFHeader({ className }: { className?: string }): React.ReactElement {
   const cv = useCVPDFTemplate();
   const { textResources } = useTextResources(texts);
   const CSS = parseCSS(className, [
      'CVPDFHeader',
      styles.CVPDFHeader,
   ]);

   return (
      <section className={CSS}>
         <Container fullwidth>
            <div className={styles.headerInfo}>
               <h1>{cv.user?.first_name} {cv.user?.last_name}</h1>
               <p>{cv.job_title}</p>
               <span>{textResources.getText('CVPDFHeader.header.experienceTime', String(cv.experience_time))}</span>
            </div>

            {/* <h2>{textResources.getText('CVPDFHeader.header.summaryTitle')}</h2>
            <hr />
            <Markdown
               className={styles.headerSummary}
               value={cv.summary}
            /> */}
         </Container>
      </section>
   );
}
