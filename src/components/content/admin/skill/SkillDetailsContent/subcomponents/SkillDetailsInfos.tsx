import { Card } from '@/components/common';
import { EditSkillForm } from '@/components/forms/skills';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import { DataContainer } from '@/components/layout';
import { Fragment, useState } from 'react';
import { useSkillDetails } from '../SkillDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../SkillDetailsContent.text';
import { EditButtons } from '@/components/buttons';

export default function SkillInfos(): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const skill = useSkillDetails();
   const { textResources } = useTextResources(texts);

   return (
      <Card padding="l">
         <WidgetHeader title={textResources.getText('SkillDetailsContent.skillInfo.title')}>
            <EditButtons
               editMode={editMode}
               setEditMode={setEditMode}
            />
         </WidgetHeader>

         {editMode && <EditSkillForm />}
         {!editMode && <Fragment>
            <DataContainer>
               <label>{textResources.getText('SkillDetailsContent.skillInfo.name')}</label>
               <span>{skill.name}</span>
            </DataContainer>
            <DataContainer>
               <label>{textResources.getText('SkillDetailsContent.skillInfo.category')}</label>
               <span>{skill.category}</span>
            </DataContainer>
            <DataContainer>
               <label>{textResources.getText('SkillDetailsContent.skillInfo.level')}</label>
               <span>{skill.level}</span>
            </DataContainer>
         </Fragment>}
      </Card>
   );
}
