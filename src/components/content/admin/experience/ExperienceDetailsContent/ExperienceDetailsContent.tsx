'use client';

import { PageHeader } from '@/components/headers';
import { ExperienceDetailsContentProps } from './ExperienceDetailsContent.types';
import ExperienceDetailsProvider from './ExperienceDetailsContext';
import { Container } from '@/components/common';
import { parseCSS } from '@/utils/parse';
import styleModule from './ExperienceDetailsContent.module.scss';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import ExperienceDetailsSection from './common/ExperienceDetailsSection';
import ExperienceSetsSection from './common/ExperienceSetsSection';
import ExperienceDetailsSidebar from './common/ExperienceDetailsSidebar';

export default function ExperienceDetailsContent({ experience }: ExperienceDetailsContentProps): React.ReactElement {
   const classes = parseCSS('ExperienceDetailsContent', styleModule.ExperienceDetailsContent);

   return (
      <ExperienceDetailsProvider experience={experience}>
         <div className={classes}>
            <PageHeader
               title="Experience Details"
               description="View and manage the details of your experience."
            />

            <section>
               <Container>
                  <ContentSidebar>
                     <Fragment>
                        <ExperienceDetailsSection />
                        <ExperienceSetsSection />
                     </Fragment>

                     <ExperienceDetailsSidebar />
                  </ContentSidebar>
               </Container>
            </section>
         </div>
      </ExperienceDetailsProvider>
   );
}
