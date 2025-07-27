import { useCVDetails } from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';
import { Form, FormInput } from '@/hooks';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { CVData } from '@/types/database.types';
import texts from './EditCVInfosForm.text';

export default function EditCVInfosForm() {
   const cv = useCVDetails();
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);


   const handleSubmit = async (data: any) => {
      try {
         const updatedCV = await ajax.post<CVData>('/curriculum/update', { id: cv.id, updates: data });

         if (!updatedCV.success) {
            throw updatedCV;
         }

         window.location.reload();
         return updatedCV;
      } catch (error) {
         throw error;
      }
   }

   return (
      <Form
         submitLabel={textResources.getText('EditCVInfosForm.submitButton')}
         initialValues={Object(cv)}
         editMode
         onSubmit={handleSubmit}
      >
         <FormInput
            fieldName="title"
            label={textResources.getText('EditCVInfosForm.field.title.label')}
            placeholder={textResources.getText('EditCVInfosForm.field.title.placeholder')}
         />
         <FormInput
            fieldName="notes"
            label={textResources.getText('EditCVInfosForm.field.notes.label')}
            placeholder={textResources.getText('EditCVInfosForm.field.notes.placeholder')}
            multiline
            minRows={3}
         />
      </Form>
   );
}
