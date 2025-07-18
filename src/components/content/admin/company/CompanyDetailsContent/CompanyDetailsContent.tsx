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

export default function CompanyDetailsContent({ company }: { company: CompanyData }): React.ReactElement {
   return (
      <CompanyDetailsProvider company={company}>
         <div className="CompanyDetailsContent">
            <PageHeader
               title="Company Details"
               description="View and manage company details"
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
