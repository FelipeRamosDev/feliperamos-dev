import { Card } from '@/components/common';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import { useCVDetails } from '../CVDetailsContext';
import styles from '../CVDetailsContent.module.scss';
import ExperienceTile from '@/components/tiles/ExperienceTile/ExperienceTile';

export default function CVExperiences({ cardProps }: CVDetailsSubcomponentProps) {
   const curriculum = useCVDetails();
   const cv_experiences = curriculum?.cv_experiences || [];

   if (!curriculum) {
      return null;
   }

   return (
      <Card className={styles.CVExperiences} {...cardProps}>
         <WidgetHeader title="CV Experiences" />

         <div className={styles.experiencesList}>
            {cv_experiences.map(exp => (
               <ExperienceTile
                  key={exp.id}
                  className={styles.experienceItem}
                  experience={exp}
               />
            ))}
         </div>
      </Card>
   );
}
