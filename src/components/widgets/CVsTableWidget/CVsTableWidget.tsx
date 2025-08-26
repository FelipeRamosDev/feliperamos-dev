import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { RoundButton } from '@/components/buttons';
import { WidgetHeader } from '@/components/headers'
import Add from '@mui/icons-material/Add';
import Link from 'next/link';
import { TableBase } from '@/components/common';
import texts from './CVsTableWidget.text';
import { useAjax } from '@/hooks/useAjax';
import { useEffect, useRef, useState } from 'react';
import { CVData } from '@/types/database.types';
import { useRouter } from 'next/navigation';

export default function CVsTableWidget(): React.ReactElement {
   const [ loading, setLoading ] = useState<boolean>(true);
   const { textResources } = useTextResources(texts);
   const [ cvs, setCVs ] = useState<CVData[]>([]);
   const ajax = useAjax();
   const isLoaded = useRef(false);
   const router = useRouter();

   useEffect(() => {
      if (isLoaded.current) {
         return;
      }

      isLoaded.current = true;
      setLoading(true);

      ajax.get<CVData[]>('/user/cvs').then((response) => {
         const data = response.data as CVData[];

         // Sorting by faveorites first
         const sorted = data?.sort((a, b) => {
            if (a.is_favorite && !b.is_favorite) {
               return -1;
            }

            if (!a.is_favorite && b.is_favorite) {
               return 1;
            }

            return b.id - a.id;
         });

         setCVs(sorted);
      }).catch(err => {
         isLoaded.current = false;
         console.error('Error fetching CVs:', err);
      }).finally(() => {
         setLoading(false);
      });
   }, [ajax]);

   return (
      <div className="CVsTableWidget">
         <WidgetHeader title={textResources.getText('CVsWidget.title')}>
            <RoundButton
               title={textResources.getText('CVsWidget.addCVButton')}
               href="/admin/curriculum/create"
               LinkComponent={Link}
               color="primary"
            >
               <Add />
            </RoundButton>
         </WidgetHeader>

         <TableBase
            items={cvs}
            loading={loading}
            usePagination
            itemsPerPage={10}
            columnConfig={[
               { propKey: 'id', label: 'ID' },
               { propKey: 'title', label: 'Title' },
               { propKey: 'notes', label: 'Notes' },
            ]}
            onClickRow={(row) => router.push(`/admin/curriculum/${row.id}`)}
         />
      </div>
   );
}
