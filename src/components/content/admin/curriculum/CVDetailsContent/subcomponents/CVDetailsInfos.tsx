import { Card } from '@/components/common';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import { useCVDetails } from '../CVDetailsContext';
import { useState } from 'react';
import { RoundButton } from '@/components/buttons';
import { Edit } from '@mui/icons-material';
import EditCVInfosForm from '@/components/forms/curriculums/EditCVInfosForm/EditCVInfosForm';

export default function CVDetailsInfos({ cardProps }: CVDetailsSubcomponentProps): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const cv = useCVDetails();

   return (
      <Card className="CVDetailsInfos" {...cardProps}>
         <WidgetHeader title="Curriculum Infos">
            {!editMode && <RoundButton title="Edit Curriculum Infos" onClick={() => setEditMode(true)}>
               <Edit />
            </RoundButton>}
         </WidgetHeader>

         {editMode && <EditCVInfosForm />}
         {!editMode && (<>
            <DataContainer>
               <label>Title:</label>
               <p>{cv.title}</p>
            </DataContainer>
            <DataContainer>
               <label>Ref Note:</label>
               <p>{cv.notes}</p>
            </DataContainer>
         </>)}
      </Card>
   );
}
