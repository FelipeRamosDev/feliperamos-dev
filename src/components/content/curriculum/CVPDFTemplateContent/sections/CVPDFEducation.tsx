import { Container, DateView, Markdown } from '@/components/common';
import styles from '../CVPDFTemplateContent.module.scss';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';

export default function CVPDFEducation() {
   const { textResources } = useTextResources();
   const cv = useCVPDFTemplate();
   const educations = cv.cv_educations || [];

   return (
      <section className={styles.CVPDFEducation}>
         <Container fullwidth>
            <h2>{textResources.getText('CVPDFEducation.title')}</h2>
            <hr />

            <ul className={styles.educationList}>
               {educations.map((education) => (
                  <li key={education.id} className={styles.educationItem}>
                     <h3>{education.institution_name}</h3>
                     <p className={styles.fieldOfStudy}>{education.field_of_study}</p>
                     <p><DateView date={education.start_date} /> - <DateView date={education.end_date} /></p>

                     {education.description && (
                        <Markdown className={styles.description} value={education.description} />
                     )}
                  </li>
               ))}
            </ul>
         </Container>
      </section>
   );
}
