'use client';

import { useAjax } from '@/hooks/useAjax';
import { useEffect, useRef, useState } from 'react';
import { TableBase } from '@/components/common/TableBase';
import { AjaxResponse, AjaxResponseError } from '@/services/Ajax/Ajax.types';
import { experienceWidgetColumns } from './experienceWidget.config';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { WidgetExperienceObject } from './ExperiencesWidget.types';

export default function ExperiencesWidget(): React.ReactElement {
   const [ experiences, setExperiences ] = useState<WidgetExperienceObject[]>([]);
   const [ loading, setLoading ] = useState<boolean>(true);
   const { textResources } = useTextResources();
   const loaded = useRef<boolean>(false);
   const ajax = useAjax();

   useEffect(() => {
      if (loaded.current) {
         return;
      }

      loaded.current = true;
      ajax.get('/experience/query', { params: { language_set: textResources.currentLanguage } }).then((response: AjaxResponse | AjaxResponseError) => {
         if (!response.success) {
            console.error('Error fetching user experiences:', response.message);
            return;
         }

         setExperiences(Array.isArray(response.data) ? response.data : []);
      }).catch((error) => {
         console.error('Error fetching user experiences:', error);
      }).finally(() => {
         setLoading(false);
      });
   }, [ ajax, textResources.currentLanguage ]);

   return (
      <TableBase
         className="ExperiencesWidget"
         columnConfig={experienceWidgetColumns}
         items={experiences}
         loading={loading}
         noDocumentsText="No experiences found."
         onClickRow={(item: WidgetExperienceObject) => console.log('Row clicked:', item)}
         usePagination
         hideHeader
      />
   );
}
