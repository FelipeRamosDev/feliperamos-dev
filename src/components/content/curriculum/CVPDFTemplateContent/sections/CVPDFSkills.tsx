import { parseCSS } from '@/helpers/parse.helpers';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import styles from '../CVPDFTemplateContent.module.scss';
import { Container } from '@/components/common';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVPDFTemplateContext.text';

export default function CVPDFSkills(): React.ReactElement {
   const cv = useCVPDFTemplate();
   const { textResources } = useTextResources(texts);
   const CSS = parseCSS('CVPDFSkills', styles.CVPDFSkills);

   return (
      <section className={CSS}>
         <div className={styles.sectionTitle}>
            <Container fullwidth>
               <h2>{textResources.getText('CVPDFSkills.title')}</h2>
               <p>{textResources.getText('CVPDFSkills.subtitle')}</p>

               <ul className={styles.chipsList}>
                  {cv.cv_skills?.map((skill, index) => (
                     <li key={index}>{skill.name}</li>
                  ))}
               </ul>
            </Container>
         </div>
      </section>
   );
}
