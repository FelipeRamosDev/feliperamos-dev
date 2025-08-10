import { Form, FormDatePicker, FormInput } from '@/hooks';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useEducationDetails } from '@/components/content/admin/education/EducationDetailsContent/EducationDetailsContext';
import texts from './EditEducationForm.texts';
import { useAjax } from '@/hooks/useAjax';
import { EducationData } from '@/types/database.types';

export default function EditEducationForm() {
   const { textResources } = useTextResources(texts);
   const education = useEducationDetails();
   const ajax = useAjax();

   const handleSubmit = async (values: any) => {
      try {
         const updated = await ajax.patch<EducationData>(`/education/update`, { education_id: education.id, updates: values });

         window.location.reload();
         return updated;
      } catch (error) {
         return error;
      }
   }

   return (
      <Form initialValues={{ ...education }} onSubmit={handleSubmit} editMode>
         <FormInput
            fieldName="institution_name"
            label={textResources.getText('EditEducationForm.fields.institution_name.label')}
            placeholder={textResources.getText('EditEducationForm.fields.institution_name.placeholder')}
         />
         <FormDatePicker
            fieldName="start_date"
            label={textResources.getText('EditEducationForm.fields.start_date.label')}
         />
         <FormDatePicker
            fieldName="end_date"
            label={textResources.getText('EditEducationForm.fields.end_date.label')}
         />
      </Form>
   );
}
