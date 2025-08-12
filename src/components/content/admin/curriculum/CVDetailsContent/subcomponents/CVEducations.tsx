import { Card } from '@/components/common';
import { useCVDetails } from '../CVDetailsContext';
import styles from '../CVDetailsContent.module.scss';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import { WidgetHeader } from '@/components/headers';
import { EducationTile } from '@/components/tiles';
import { EditButtons } from '@/components/buttons';
import { useState } from 'react';
import { DataContainer } from '@/components/layout';
import { EditCVEducationsForm } from '@/components/forms/curriculums';

export default function CVEducations({ cardProps }: CVDetailsSubcomponentProps) {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const cv = useCVDetails();
   const educations = cv?.cv_educations?.sort((a, b) => {
      if (a.end_date && b.end_date) {
         return a.end_date < b.end_date ? 1 : -1;
      }

      return 0;
   }) || [];

   return (
      <Card className={styles.CVEducations} {...cardProps}>
         <WidgetHeader title="Educations">
            <EditButtons editMode={editMode} setEditMode={setEditMode} />
         </WidgetHeader>

         {editMode && <EditCVEducationsForm />}
         {!editMode && educations.map((education) => <EducationTile key={education.id} education={education} />)}
         {educations.length === 0 && !editMode && <DataContainer>No educations added yet.</DataContainer>}
      </Card>
   );
}
