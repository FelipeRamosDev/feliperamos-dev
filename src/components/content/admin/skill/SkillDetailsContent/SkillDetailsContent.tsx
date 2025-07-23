'use client';

import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import SkillDetailsProvider from './SkillDetailsContext';
import { SkillData } from '@/types/database.types';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import SkillDetailsSets from './subcomponents/SkillDetailsSets';
import SkillInfos from './subcomponents/SkillDetailsInfos';
import SkillDetailsSidebar from './subcomponents/SkillDetailsSidebar';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './SkillDetailsContent.text';

export default function SkillDetailsContent({ skill }: { skill: SkillData }): React.ReactElement {
   const { textResources } = useTextResources(texts);

   return (
      <SkillDetailsProvider skill={skill}>
         <div className="SkillDetailsContent">
            <PageHeader
               title={textResources.getText('SkillDetailsContent.title')}
               description={textResources.getText('SkillDetailsContent.subtitle')}
            />

            <Container>
               <ContentSidebar>
                  <Fragment>
                     <SkillInfos />
                     <SkillDetailsSets />
                  </Fragment>

                  <SkillDetailsSidebar />
               </ContentSidebar>
            </Container>
         </div>
      </SkillDetailsProvider>
   );
}
