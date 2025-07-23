'use client';

import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers'
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import CompanyDetailsProvider from './CompanyDetailsContext';
import { CompanyData } from '@/types/database.types';
import CompanyDetailsInfo from './slices/CompanyDetailsInfo';
import CompanyDetailsSets from './slices/CompanyDetailsSets';
import CompanyDetailsSidebar from './slices/CompanyDetailsSidebar';
import texts from './CompanyDetailsContent.text';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

export default function CompanyDetailsContent({ company }: { company: CompanyData }): React.ReactElement {
   const { textResources } = useTextResources(texts);

   return (
      <CompanyDetailsProvider company={company}>
         <div className="CompanyDetailsContent">
            <PageHeader
               title={textResources.getText('CompanyDetailsContent.pageHeader.title')}
               description={textResources.getText('CompanyDetailsContent.pageHeader.description')}
            />

            <Container>
               <ContentSidebar>
                  <Fragment>
                     <CompanyDetailsInfo />
                     <CompanyDetailsSets />
                  </Fragment>

                  <CompanyDetailsSidebar />
               </ContentSidebar>
            </Container>
         </div>
      </CompanyDetailsProvider>
   );
}
