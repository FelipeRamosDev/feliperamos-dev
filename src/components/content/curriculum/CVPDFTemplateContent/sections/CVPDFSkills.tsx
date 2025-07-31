import { parseCSS } from '@/helpers/parse.helpers';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import styles from '../CVPDFTemplateContent.module.scss';
import { Container } from '@/components/common';

export default function CVPDFSkills(): React.ReactElement {
   const cv = useCVPDFTemplate();
   const CSS = parseCSS('CVPDFSkills', styles.CVPDFSkills);

   return (
      <section className={CSS}>
         <div className={styles.sectionTitle}>
            <Container fullwidth>
               <h2>Skills</h2>
               <p>Programming Languages, Frameworks, Development Tools, Libraries, and others.</p>

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
