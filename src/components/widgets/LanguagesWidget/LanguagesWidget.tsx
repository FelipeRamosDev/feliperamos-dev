import { WidgetHeader } from '@/components/headers';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './LanguagesWidget.texts';
import { TableBase } from '@/components/common';
import { LanguageWidgetProps } from './LanguagesWidget.types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { parseCSS } from '@/helpers/parse.helpers';
import { useAjax } from '@/hooks/useAjax';
import { LanguageData } from '@/types/database.types';
import { useRouter } from 'next/navigation';
import { RoundButton } from '@/components/buttons';
import Link from 'next/link';
import { Add } from '@mui/icons-material';
import { displayProficiency } from '@/helpers/app.helpers';

export default function LanguagesWidget({ className, languages }: LanguageWidgetProps) {
   const normalizedLanguages = useMemo<LanguageData[]>(() => (
      Array.isArray(languages) ? languages : []
   ), [ languages ]);

   const [ loading, setLoading ] = useState<boolean>(false);
   const [ langs, setLangs ] = useState<LanguageData[]>(() => normalizedLanguages);
   const hasFetched = useRef<boolean>(false);
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const router = useRouter();

   const CSS = parseCSS(className, [ 'LanguagesWidget' ]);

   // Fetch only when languages prop is truly absent (undefined/null) AND we haven't fetched yet.
   useEffect(() => {
      if (languages !== undefined && languages !== null) {
         return; // prop supplied (even empty)
      }

      if (hasFetched.current) {
         return;
      }

      hasFetched.current = true;
      setLoading(true);

      ajax.get<LanguageData[]>('/user/languages')
         .then(res => setLangs(res.data as LanguageData[]))
         .catch(err => {
            if (process.env.NODE_ENV !== 'production') {
               console.error('Error fetching languages:', err);
            }
         })
         .finally(() => setLoading(false));
   }, [ ajax, languages ]);

   // Sync internal state to prop when provided.
   useEffect(() => {
      if (languages === undefined || languages === null) return; // nothing to sync (fetch path handles)
      setLangs(prev => (prev === normalizedLanguages ? prev : normalizedLanguages));
      // If we were loading (from a previous fetch) but now have prop data, clear loading.
      if (loading) setLoading(false);
   }, [ normalizedLanguages, languages, loading ]);

   return (
      <div className={CSS} data-testid="languages-widget">
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
               { propKey: 'locale_name', label: '--' },
               {
                  propKey: 'proficiency',
                  label: '--',
                  format: (_, item) => displayProficiency((item as LanguageData).proficiency, textResources.currentLanguage)
               }
            ]}
         />
      </div>
   );
}
