import { Fragment, useState } from 'react';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import { Card } from '@/components/common';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import { useCVDetails } from '../CVDetailsContext';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import { SkillBadge } from '@/components/badges';
import { RoundButton } from '@/components/buttons';
import { Edit } from '@mui/icons-material';
import EditCVSkillsForm from '@/components/forms/curriculums/EditCVSkillsForm/EditCVSkillsForm';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVDetailsContent.text';

export default function CVDetailsSidebar({ cardProps }: CVDetailsSubcomponentProps): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);
   const cv = useCVDetails();
   const cv_skills = cv?.cv_skills || [];

   return (
      <Fragment>
         <Card {...cardProps}>
            <DataContainer>
               <label>{textResources.getText('CVDetailsSidebar.field.id.label')}</label>
               <p>{cv.id}</p>
            </DataContainer>
            <DataContainer>
               <label>{textResources.getText('CVDetailsSidebar.field.createdAt.label')}</label>
               <p>{new Date(cv.created_at).toLocaleString()}</p>
            </DataContainer>
            {cv.updated_at && (
               <DataContainer>
                  <label>{textResources.getText('CVDetailsSidebar.field.updatedAt.label')}</label>
                  <p>{new Date(cv.updated_at).toLocaleString()}</p>
               </DataContainer>
            )}
         </Card>

         <Card {...cardProps}>
            <WidgetHeader title={textResources.getText('CVDetailsSidebar.skills.widgetTitle')}>
               {!editMode && (
                  <RoundButton title={textResources.getText('CVDetailsSidebar.skills.editButton')} onClick={() => setEditMode(true)}>
                     <Edit />
                  </RoundButton>
               )}
            </WidgetHeader>

            {editMode && <EditCVSkillsForm />}
            {!editMode && <div className="skills-list">
               {cv_skills.length > 0 && cv_skills.map((skill) => (
                  <SkillBadge key={skill.id} value={skill.name} />
               ))}
            </div>}
         </Card>
      </Fragment>
   );
}
