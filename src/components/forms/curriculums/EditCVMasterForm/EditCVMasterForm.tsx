import { useCVDetails } from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditCVMasterForm.text';
import { useAjax } from '@/hooks/useAjax';
import { CVData } from '@/types/database.types';
import { useState } from 'react';
import { Form, FormSubmit } from '@/hooks';

export default function EditCVMasterForm() {
   const { textResources } = useTextResources(texts);
   const [ loading, setLoading ] = useState<boolean>(false);
   const cv = useCVDetails();
   const ajax = useAjax();

   const setMaster = async () => {
      setLoading(true);

      try {
         const updatedMaster = await ajax.post<CVData>('/curriculum/set-master', { cv_id: cv.id });

         if (!updatedMaster.success) {
            throw updatedMaster;
         }

         window.location.reload();
         return updatedMaster;
      } catch (error) {
         throw error;
      } finally {
         setLoading(false);
      }
   }

   return (
      <Form onSubmit={setMaster} hideSubmit>
         <FormSubmit
            disabled={loading}
            fullWidth
            loading={loading}
            label={textResources.getText('EditCVMasterForm.is_master.label')}
         />
      </Form>
   );
}
