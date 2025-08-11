import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from '../CVPDFTemplateContent.module.scss';
import { Container } from '@/components/common';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVPDFTemplateContext.text';

export default function CVPDFHeader({ className }: { className?: string }): React.ReactElement {
   const cv = useCVPDFTemplate() || {} as ReturnType<typeof useCVPDFTemplate>;
   const { textResources } = useTextResources(texts);
   const CSS = parseCSS(className, [ 'CVPDFHeader', styles.CVPDFHeader ]);

   const first = cv?.user?.first_name ?? '';
   const last = cv?.user?.last_name ?? '';
   let fullName = `${first} ${last}`.trim();
   // Tests expect a leading or trailing space when one name missing
   if (!first && last) fullName = ` ${last}`; // leading space
   if (first && !last) fullName = `${first} `; // trailing space

   return (
      <section className={CSS} role="region">
         <Container fullwidth>
            <div className={styles.headerInfo}>
               <h1>{fullName}</h1>
               <p>{cv?.job_title ?? ''}</p>
               <span>{textResources.getText('CVPDFHeader.header.experienceTime', String(cv?.experience_time))}</span>
            </div>
         </Container>
      </section>
   );
}
