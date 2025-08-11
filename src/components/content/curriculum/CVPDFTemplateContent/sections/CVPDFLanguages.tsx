import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import styles from '../CVPDFTemplateContent.module.scss';
import { Container } from '@/components/common';

export default function CVPDFLanguages() {
   const { textResources } = useTextResources();
   const cv = useCVPDFTemplate();
   const languages = cv.cv_languages || [];

   return (
      <section className={styles.CVPDFLanguages}>
         <Container fullwidth>
            <h2>{textResources.getText('CVPDFLanguages.title')}</h2>
            <hr />

            <ul className={styles.languageList}>
               {languages.map((language) => (
                  <li key={language.id} className={styles.languageItem}>
                     <span className={styles.languageTitle}>{language.default_name}</span>
                     <p>{language.level}</p>
                  </li>
               ))}
            </ul>
         </Container>
      </section>
   );
}
