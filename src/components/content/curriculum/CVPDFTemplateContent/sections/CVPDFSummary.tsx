import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import texts from '../CVPDFTemplateContext.text';
import styles from '../CVPDFTemplateContent.module.scss';
import { parseCSS } from '@/helpers/parse.helpers';
import { Container, Markdown } from '@/components/common';

export default function CVPDFSummary(): React.ReactElement {
   const cv = useCVPDFTemplate();
   const { textResources } = useTextResources(texts);
   const CSS = parseCSS('CVPDFSummary', styles.CVPDFSummary);

   return (
      <section className={CSS}>
         <Container fullwidth>
            <h2>{textResources.getText('CVPDFHeader.header.summaryTitle')}</h2>
            <hr />

            <Markdown
               className={styles.summary}
               value={cv.summary}
            />
         </Container>
      </section>
   );
}
