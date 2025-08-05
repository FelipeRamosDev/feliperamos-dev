import { parseCSS } from '@/helpers/parse.helpers';
import { CVsWidgetProps } from './CVsWidget.types';
import { WidgetHeader } from '@/components/headers';
import { Add } from '@mui/icons-material';
import Link from 'next/link';
import styles from './CVsWidget.module.scss';
import { useEffect, useRef, useState } from 'react';
import { CVData } from '@/types/database.types';
import { CVTile } from '@/components/tiles';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useRouter } from 'next/navigation';
import { Card, Spinner } from '@/components/common';
import texts from './CVsWidget.text';
import { RoundButton } from '@/components/buttons';

export default function CVsWidget({ className }: CVsWidgetProps): React.ReactElement {
   const [ cvs, setCvs ] = useState<CVData[]>([]);
   const [ loading, setLoading ] = useState<boolean>(true);
   const loaded = useRef<boolean>(false);
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);
   const router = useRouter();

   const CSS = parseCSS(className, [
      'CVsWidget',
      styles.CVsWidget
   ]);

   useEffect(() => {
      if (loaded.current) {
         return;
      }

      loaded.current = true;
      ajax.get<CVData[]>('/curriculum/user-cvs', { params: { language_set: textResources.currentLanguage } }).then((response) => {
         if (!response.success) {
            console.error('Failed to fetch CVs:', response);
            return;
         }

         setCvs(response.data);
      }).catch((error) => {
         console.error('Error fetching CVs:', error);
      }).finally(() => {
         setLoading(false);
      });
   }, [ajax, textResources.currentLanguage]);

   return (
      <div className={CSS}>
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

         {loading && (
            <Card className={styles.loading} padding="l" elevation="none">
               <Spinner />
            </Card>
         )}

         {cvs.length === 0 && !loading && (
            <Card
               className={styles.noCV}
               elevation="none"
            >
               <p>{textResources.getText('CVsWidget.noCV')}</p>
            </Card>
         )}

         {cvs.length > 0 && !loading && (
            <div className={styles.cvsList}>
               {cvs.map((cv) => (
                  <CVTile
                     key={cv.id}
                     className={styles.listItem}
                     cv={cv}
                     onClick={(cvId) => router.push(`/admin/curriculum/${cvId}`)}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
