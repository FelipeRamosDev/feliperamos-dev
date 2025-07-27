import { Card } from '@/components/common';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import { useCVDetails } from '../CVDetailsContext';
import styles from '../CVDetailsContent.module.scss';
import ExperienceTile from '@/components/tiles/ExperienceTile/ExperienceTile';
import { RoundButton } from '@/components/buttons';
import { Edit } from '@mui/icons-material';
import { useState } from 'react';
import EditCVExperiencesForm from '@/components/forms/curriculums/EditCVExperiencesForm/EditCVExperiencesForm';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVDetailsContent.text';

export default function CVExperiences({ cardProps }: CVDetailsSubcomponentProps) {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const curriculum = useCVDetails();
   const { textResources } = useTextResources(texts);
   const cv_experiences = curriculum?.cv_experiences || [];

   if (!curriculum) {
      return null;
   }

   return (
      <Card className={styles.CVExperiences} {...cardProps}>
         <WidgetHeader title={textResources.getText('CVExperiences.widgetTitle')}>
            {!editMode && (
               <RoundButton title={textResources.getText('CVExperiences.editButton')} onClick={() => setEditMode(true)}>
                  <Edit />
               </RoundButton>
            )}
         </WidgetHeader>

         {editMode && <EditCVExperiencesForm />}
         {!editMode && <div className={styles.experiencesList}>
            {cv_experiences.map(exp => (
               <ExperienceTile
                  key={exp.id}
                  className={styles.experienceItem}
                  experience={exp}
               />
            ))}
         </div>}
      </Card>
   );
}
