'use client';

import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import { OpportunitiesTable } from '@/components/tables';

export default function OpportunitySearch() {
   return (
      <div className="OpportunitySearch">
         <PageHeader
            title="Opportunities"
            description="Search and manage opportunities"
         />

         <Container fullwidth>
            <OpportunitiesTable />
         </Container>
      </div>
   );
}
