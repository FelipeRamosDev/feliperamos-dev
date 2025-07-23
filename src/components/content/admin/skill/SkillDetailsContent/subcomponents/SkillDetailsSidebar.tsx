import { Card } from '@/components/common';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import { Fragment } from 'react';
import { useSkillDetails } from '../SkillDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../SkillDetailsContent.text';

export default function SkillDetailsSidebar(): React.ReactElement {
   const skill = useSkillDetails();
   const { textResources } = useTextResources(texts);

   return (
      <Fragment>
         <Card padding="l">
            <DataContainer>
               <label>{textResources.getText('SkillDetailsContent.skillSidebar.id')}</label>
               <span>{skill.id}</span>
            </DataContainer>
         </Card>
      </Fragment>
   );
}
