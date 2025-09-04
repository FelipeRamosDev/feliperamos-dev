import React, { useEffect, useRef, useState } from 'react';
import { TableBase } from '@/components/common';
import { opportunitiesTableConfig } from './OpportunitiesTable.config';
import type { OpportunitiesTableProps } from './OpportunitiesTable.types';
import type { OpportunityData } from '@/types/database.types';
import { useAjax } from '@/hooks/useAjax';

export default function OpportunitiesTable({ where, sort, order }: OpportunitiesTableProps): React.JSX.Element {
   const [ isLoading, setIsLoading ] = useState<boolean>(true);
   const [ items, setItems ] = useState<OpportunityData[]>([]);
   const isLoaded = useRef<boolean>(false);
   const ajax = useAjax();

   useEffect(() => {
      if (isLoaded.current) return;
      let whereString: string | undefined;

      isLoaded.current = true;
      try {
         whereString = JSON.stringify(where || {});
      } catch (error) {
         console.error('Error stringifying "where" parameter:', error);
         return;
      }

      ajax.get<OpportunityData[]>('/opportunity/search', { params: { where: whereString, sort, order } }).then((response) => {
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
   }, [ ajax, where, sort, order ]);

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
