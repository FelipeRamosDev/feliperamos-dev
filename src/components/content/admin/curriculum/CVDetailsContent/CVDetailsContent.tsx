'use client';

import { Container } from '@/components/common';
import { CVDetailsContentProps } from './CVDetailsContent.types';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import { PageHeader } from '@/components/headers';
import { CardProps } from '@/components/common/Card/Card.types';
import CVDetailsProvider from './CVDetailsContext';
import CVDetailsInfos from './subcomponents/CVDetailsInfos';
import CVDetailsSidebar from './subcomponents/CVDetailsSidebar';
import CVDetailsSet from './subcomponents/CVDetailsSets';
import CVExperiences from './subcomponents/CVExperiences';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './CVDetailsContent.text';

export default function CVDetailsContent({ cv }: CVDetailsContentProps) {
   const cardProps: CardProps = { padding: 'm' };
   const { textResources } = useTextResources(texts);

   return (
      <CVDetailsProvider cv={cv}>
         <div className="CVDetailsContent">
            <PageHeader
               title={textResources.getText('CVDetailsContent.pageTitle')}
               description={textResources.getText('CVDetailsContent.pageDescription')}
            />

            <Container>
               <ContentSidebar>
                  <Fragment>
                     <CVDetailsInfos cardProps={cardProps} />
                     <CVDetailsSet cardProps={cardProps} />
                     <CVExperiences cardProps={cardProps} />
                  </Fragment>

                  <CVDetailsSidebar cardProps={cardProps} />
               </ContentSidebar>
            </Container>
         </div>
      </CVDetailsProvider>
   );
}
