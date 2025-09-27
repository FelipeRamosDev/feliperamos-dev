'use client';

import { RoundButton } from '@/components/buttons';
import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import { OpportunitiesTable } from '@/components/tables';
import { Add } from '@mui/icons-material';

export default function OpportunitySearch() {
   return (
      <div className="OpportunitySearch">
         <PageHeader
            title="Opportunities"
            description="Search and manage opportunities"
         >
            <RoundButton title="Add Opportunity" color="primary" href="/admin/opportunity/create">
               <Add />
            </RoundButton>
         </PageHeader>

         <Container fullwidth>
            <OpportunitiesTable />
         </Container>
      </div>
   );
}
