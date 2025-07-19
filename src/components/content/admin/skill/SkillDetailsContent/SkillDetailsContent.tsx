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

export default function SkillDetailsContent({ skill }: { skill: SkillData }): React.ReactElement {
   return (
      <SkillDetailsProvider skill={skill}>
         <div className="SkillDetailsContent">
            <PageHeader
               title="Skill Details"
               description="View and manage the details of a specific skill."
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
