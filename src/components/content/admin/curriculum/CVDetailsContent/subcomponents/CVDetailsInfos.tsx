import { Card } from '@/components/common';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import { WidgetHeader } from '@/components/headers';
import { DataContainer } from '@/components/layout';
import { useCVDetails } from '../CVDetailsContext';
import { useState } from 'react';
import { EditButtons } from '@/components/buttons';
import { EditCVInfosForm } from '@/components/forms/curriculums';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVDetailsContent.text';

export default function CVDetailsInfos({ cardProps }: CVDetailsSubcomponentProps): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);
   const cv = useCVDetails();

   return (
      <Card className="CVDetailsInfos" {...cardProps}>
         <WidgetHeader title={textResources.getText('CVDetailsInfos.widgetTitle')}>
            <EditButtons
               editMode={editMode}
               setEditMode={setEditMode}
            />
         </WidgetHeader>

         {editMode && <EditCVInfosForm />}
         {!editMode && (<>
            <DataContainer>
               <label>{textResources.getText('CVDetailsInfos.title.label')}</label>
               <p>{cv.title}</p>
            </DataContainer>
            <DataContainer>
               <label>{textResources.getText('CVDetailsInfos.experienceTime.label')}</label>
               <p>{cv.experience_time}</p>
            </DataContainer>
            <DataContainer>
               <label>{textResources.getText('CVDetailsInfos.notes.label')}</label>
               <p>{cv.notes}</p>
            </DataContainer>
         </>)}
      </Card>
   );
}
