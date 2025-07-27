'use client';

import { PageHeader } from '@/components/headers';
import { ExperienceDetailsContentProps } from './ExperienceDetailsContent.types';
import ExperienceDetailsProvider from './ExperienceDetailsContext';
import { Container } from '@/components/common';
import { parseCSS } from '@/helpers/parse.helpers';
import styleModule from './ExperienceDetailsContent.module.scss';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import ExperienceDetailsSection from './common/ExperienceDetailsSection';
import ExperienceSetsSection from './common/ExperienceSetsSection';
import ExperienceDetailsSidebar from './common/ExperienceDetailsSidebar';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './ExperienceDetailsContent.text';

export default function ExperienceDetailsContent({ experience }: ExperienceDetailsContentProps): React.ReactElement {
   const classes = parseCSS('ExperienceDetailsContent', styleModule.ExperienceDetailsContent);
   const { textResources } = useTextResources(texts);

   return (
      <ExperienceDetailsProvider experience={experience}>
         <div className={classes}>
            <PageHeader
               title={textResources.getText('ExperienceDetailsContent.pageHeader.title')}
               description={textResources.getText('ExperienceDetailsContent.pageHeader.description')}
            />

            <Container>
               <ContentSidebar>
                  <Fragment>
                     <ExperienceDetailsSection />
                     <ExperienceSetsSection />
                  </Fragment>

                  <ExperienceDetailsSidebar />
               </ContentSidebar>
            </Container>
         </div>
      </ExperienceDetailsProvider>
   );
}
