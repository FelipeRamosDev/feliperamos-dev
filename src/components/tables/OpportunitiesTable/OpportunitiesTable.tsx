import React, { useEffect, useRef } from 'react';
import { TableBase } from '@/components/common';
import { opportunitiesTableConfig } from './OpportunitiesTable.config';
import { OpportunityModal } from '@/components/modals';

// Types
import type { OpportunitiesTableProps } from './OpportunitiesTable.types';
import type { OpportunityData } from '@/types/database.types';
import { useOpportunities } from '@/hooks';

export default function OpportunitiesTable({ where, sort, order }: OpportunitiesTableProps): React.JSX.Element {
   const { opportunities, loading, fetchOpportunities, updateOpportunity, selected, setSelected } = useOpportunities({ where, sort, order });
   const isLoaded = useRef<boolean>(false);

   useEffect(() => {
      if (isLoaded.current) return;

      isLoaded.current = true;
      fetchOpportunities().catch((error) => {
         console.error('Error fetching opportunities:', error);
      });
   }, [ where, sort, order, fetchOpportunities ]);

   useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const opportunityId = Number(searchParams.get('opportunity_id'));

      if (opportunityId && !isNaN(opportunityId)) {
         const cachedOpportunity = opportunities.find(item => item.id === opportunityId);

         setSelected(cachedOpportunity || null);
      }
   }, [ opportunities, setSelected ]);

   return (
      <>
         <TableBase<OpportunityData>
            className="OpportunitiesTable"
            items={opportunities}
            columnConfig={opportunitiesTableConfig}
            loading={loading}
            noDocumentsText="No opportunities found"
            onClickRow={(item) => setSelected(item)}  
         />

         <OpportunityModal
            isOpen={!!selected}
            onClose={() => setSelected(null)}
            data={selected}
            updateData={updateOpportunity}
         />
      </>
   );
}
