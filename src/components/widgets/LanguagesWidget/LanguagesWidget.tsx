import { WidgetHeader } from '@/components/headers';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './LanguagesWidget.texts'
import { TableBase } from '@/components/common';
import { LanguageWidgetProps } from './LanguagesWidget.types';
import React, { useEffect, useRef, useState } from 'react';
import { parseCSS } from '@/helpers/parse.helpers';
import { useAjax } from '@/hooks/useAjax';
import { LanguageData } from '@/types/database.types';
import { useRouter } from 'next/navigation';
import { RoundButton } from '@/components/buttons';
import Link from 'next/link';
import { Add } from '@mui/icons-material';
import { displayProficiency } from '@/helpers/app.helpers';

export default function LanguagesWidget({ className, languages = [] }: LanguageWidgetProps) {
   const [ loading, setLoading ] = useState<boolean>(true);
   const [ langs, setLangs ] = useState<LanguageData[]>(languages);
   const isReady = useRef<boolean>(false);
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const router = useRouter();

   const CSS = parseCSS(className, [
      'LanguagesWidget'
   ]);

   useEffect(() => {
      if (isReady.current) {
         return;
      }

      isReady.current = true;
      ajax.get<LanguageData[]>('/user/languages').then((response) => {
         setLangs(response.data as LanguageData[]);
      }).catch(err => {
         console.error('Error fetching languages:', err);
      }).finally(() => {
         setLoading(false);
      });
   }, [ ajax ]);

   return (
      <div className={CSS}>
         <WidgetHeader title={textResources.getText('LanguagesWidget.title')}>
            <RoundButton
               title={textResources.getText('LanguagesWidget.addButton.title')}
               LinkComponent={Link}
               color="primary"
               href="/admin/language/create"
            >
               <Add />
            </RoundButton>
         </WidgetHeader>

         <TableBase
            hideHeader
            items={langs}
            loading={loading}
            noDocumentsText={textResources.getText('LanguagesWidget.noLanguages')}
            onClickRow={(item) => router.push(`/admin/language/${item.id}`)}
            columnConfig={[
               {
                  propKey: 'locale_name',
                  label: '--'
               },
               {
                  propKey: 'proficiency',
                  label: '--',
                  format: (_, item) => {
                     const row = item as LanguageData;
                     return displayProficiency(row.proficiency, textResources.currentLanguage);
                  }
               }
            ]}
         />
      </div>
   );
}
