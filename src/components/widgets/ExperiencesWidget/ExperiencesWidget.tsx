'use client';

import { useAjax } from '@/hooks/useAjax';
import { useEffect, useRef, useState } from 'react';
import { TableBase } from '@/components/common/TableBase';
import { AjaxResponse, AjaxResponseError } from '@/services/Ajax/Ajax.types';
import { experienceWidgetColumns } from './experienceWidget.config';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { WidgetExperienceObject } from './ExperiencesWidget.types';
import { Button } from '@mui/material';
import Link from 'next/link';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import texts from './ExperiencesWidget.text'

export default function ExperiencesWidget(): React.ReactElement {
   const [experiences, setExperiences] = useState<WidgetExperienceObject[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const { textResources } = useTextResources(texts);
   const loaded = useRef<boolean>(false);
   const ajax = useAjax();
   const router = useRouter();

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
   }, [ajax, textResources.currentLanguage]);

   return (
      <div className="ExperiencesWidget">
         <WidgetHeader title={textResources.getText('ExperiencesWidget.headerTitle')}>
            <Button
               LinkComponent={Link}
               href="/admin/experience/create"
               variant="contained"
               color="primary"
               startIcon={<AddIcon />}
            >
               {textResources.getText('ExperiencesWidget.addExperienceButton')}
            </Button>
         </WidgetHeader>

         <TableBase
            className="experiences-table"
            columnConfig={experienceWidgetColumns}
            items={experiences}
            loading={loading}
            noDocumentsText={textResources.getText('ExperiencesWidget.noDocumentsText')}
            onClickRow={(item: WidgetExperienceObject) => router.push(`/admin/experience/${item.id}`)}
            usePagination
            hideHeader
         />
      </div>
   );
}
