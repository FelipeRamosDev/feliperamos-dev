import { parseCSS } from '@/helpers/parse.helpers';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import styles from '../CVPDFTemplateContent.module.scss';
import { Container } from '@/components/common';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVPDFTemplateContext.text';
import { SkillData } from '@/types/database.types';
import { Fragment } from 'react';

export default function CVPDFSkills(): React.ReactElement {
   const cv = useCVPDFTemplate();
   const { textResources } = useTextResources(texts);
   const CSS = parseCSS('CVPDFSkills', styles.CVPDFSkills);
   const cats = new Map<string, SkillData[]>();

   cv.cv_skills?.forEach(skill => {
      if (!cats.has(skill.category)) {
         cats.set(skill.category, []);
      }

      cats.get(skill.category)?.push(skill);
   });

   return (
      <section className={CSS}>
         <Container fullwidth>
            <h2>{textResources.getText('CVPDFSkills.title')}</h2>

            {Array.from(cats.entries()).map(([ key, value]) => <Fragment key={key}>
               <h3>{textResources.getText(`CVPDFSkills.skills.${key}`)}</h3>
               <ul className={styles.chipsList}>
                  {value.map((skill, index) => (
                     <li key={index}>{skill.name}</li>
                  ))}
               </ul>
            </Fragment>)}
         </Container>
      </section>
   );
}
