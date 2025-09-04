import { Card } from '@/components/common';
import { WidgetHeader } from '@/components/headers';
import { loadUserCVs } from '@/helpers/database.helpers';
import { FormSelect } from '@/hooks';
import { FormSelectOption } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useEffect, useRef } from 'react';
import { CustomCVProps } from '../BuildOpportunityForm.types';

export default function CustomCV({ userCVs, setUserCVs, setSelectedCV }: CustomCVProps) {
   const { textResources } = useTextResources();
   const cvLoadRef = useRef<boolean>(false);
   const ajax = useAjax();

   const cvTemplates: FormSelectOption[] = userCVs.map(cv => ({
      value: cv.id,
      label: cv.title
   }));

   useEffect(() => {
      if (cvLoadRef.current) return;

      cvLoadRef.current = true;
      loadUserCVs(ajax, textResources).then(cvs => {
         setUserCVs(cvs);
      }).catch(err => {
         console.error('Error loading user CVs:', err);
      });
   }, [ajax, textResources, setUserCVs]);

   return (
      <Card>
         <WidgetHeader title="Custom CV" />

         {(cvTemplates.length > 0) ? (
            <FormSelect
               fieldName="cvTemplate"
               label="CV Template"
               options={cvTemplates}
               onChange={(value) => setSelectedCV(Number(value))}
            />
         ) : (
            <p>No CV templates available</p>
         )}
      </Card>
   );
}
