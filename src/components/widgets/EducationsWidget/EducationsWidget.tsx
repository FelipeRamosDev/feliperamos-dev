import { WidgetHeader } from '@/components/headers';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EducationsWidget.texts';
import { RoundButton } from '@/components/buttons';
import { Add } from '@mui/icons-material';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { EducationData } from '@/types/database.types';
import { useAjax } from '@/hooks/useAjax';
import { DateView, TableBase } from '@/components/common';
import { useRouter } from 'next/navigation';

import type {
   EducationsWidgetProps
} from './EducationsWidget.types';

export default function EducationsWidget({ educations }: EducationsWidgetProps) {
   const [ edus, setEdus ] = useState<EducationData[]>(educations || []);
   const [ loading, setLoading ] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);
   const isLoaded = useRef<boolean>(false);
   const ajax = useAjax();
   const router = useRouter();
   const EMPTY_FALLBACK = '---';

   useEffect(() => {
      if (isLoaded.current || educations) return;

      isLoaded.current = true;
      ajax.get<EducationData[]>('/user/educations').then((response) => {
         if (response.error) {
            throw new Error(response.message);
         }

         setEdus(response.data);
      }).catch((err) => {
         console.error(err);
      }).finally(() => {
         setLoading(false);
      });
   }, [ ajax, educations ]);

   return (
      <div className="EducationsWidget">
         <WidgetHeader title={textResources.getText('EducationsWidget.headerTitle')}>
            <RoundButton
               title={textResources.getText('EducationsWidget.addButton')}
               LinkComponent={Link}
               href="/admin/education/create"
               color="primary"
            >
               <Add />
            </RoundButton>
         </WidgetHeader>

         <TableBase
            hideHeader
            items={edus}
            loading={loading}
            onClickRow={(item) => router.push(`/admin/education/${item.id}`)}
            noDocumentsText={textResources.getText('EducationsWidget.noData')}
            columnConfig={[{
               propKey: 'data',
               label: '---',
               format: (_, row) => {
                  const item = row as EducationData;
                  

                  return <>
                     <b>{item.institution_name}</b><br />
                     <span>{item.field_of_study ?? EMPTY_FALLBACK}</span>
                     <p><DateView date={item.start_date} /> to <DateView date={item.end_date} /></p>
                  </>;
               }
            }]}
         />
      </div>
   );
}
