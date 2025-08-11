import { useCVDetails } from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';
import { loadEducationsOptions } from '@/helpers/database.helpers';
import { Form } from '@/hooks';
import FormCheckboxList from '@/hooks/Form/inputs/FormCheckboxList';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditCVEducationsForm.texts'
import { FormValues } from '@/hooks/Form/Form.types';
import { CVData } from '@/types/database.types';

export default function EditCVEducationsForm(): React.ReactElement {
   const cv = useCVDetails();
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const educations = cv?.cv_educations || [];

   if (!cv) {
      return <></>;
   }

   const handleSubmit = async (values: FormValues) => {
      try {
         const response = await ajax.post<CVData>('/curriculum/update', { id: cv.id, updates: values });

         if (response.error) {
            throw response;
         }

         window.location.reload();
         return response;
      } catch (error) {
         return error;
      }
   }

   return (
      <Form
         onSubmit={handleSubmit}
         submitLabel={textResources.getText('EditCVEducationsForm.saveButton')}
         initialValues={{ cv_educations: educations.map(edu => edu.id) }}
         editMode
      >
         <FormCheckboxList
            fieldName="cv_educations"
            loadOptions={async () => await loadEducationsOptions(ajax, textResources.currentLanguage)}
         />
      </Form>
   );
}
