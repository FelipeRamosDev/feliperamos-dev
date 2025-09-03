import React, { useEffect, useRef, useState } from 'react';
import { TableBase } from '@/components/common';
import { opportunitiesTableConfig } from './OpportunitiesTable.config';
import type { OpportunitiesTableProps } from './OpportunitiesTable.types';
import type { OpportunityData } from '@/types/database.types';
import { useAjax } from '@/hooks/useAjax';

export default function OpportunitiesTable({ where }: OpportunitiesTableProps): React.JSX.Element {
   const [ isLoading, setIsLoading ] = useState<boolean>(true);
   const [ items, setItems ] = useState<OpportunityData[]>([]);
   const isLoaded = useRef<boolean>(false);
   const ajax = useAjax();

   useEffect(() => {
      if (isLoaded.current) return;

      isLoaded.current = true;
      ajax.get<OpportunityData[]>('/opportunity/search', { params: { where } }).then((response) => {
         if (response.error) {
            console.error('Error fetching opportunities:', response.message);
            return;
         }

         setItems(response.data);
      }).catch((error) => {
         console.error('Error fetching opportunities:', error);
      }).finally(() => {
         setIsLoading(false);
      });
   }, [ajax, where]);

   return (
      <TableBase<OpportunityData>
         className="OpportunitiesTable"
         items={items}
         columnConfig={opportunitiesTableConfig}
         loading={isLoading}
         noDocumentsText="No opportunities found"
      />
   );
}
