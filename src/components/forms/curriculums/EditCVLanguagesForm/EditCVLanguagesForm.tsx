import { useCVDetails } from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';
import { loadLanguagesOptions } from '@/helpers/database.helpers';
import { Form } from '@/hooks';
import FormCheckboxList from '@/hooks/Form/inputs/FormCheckboxList';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditCVLanguagesForm.texts'
import { FormValues } from '@/hooks/Form/Form.types';
import { CVData } from '@/types/database.types';

export default function EditCVLanguagesForm(): React.ReactElement {
   const cv = useCVDetails();
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const languages = cv?.cv_languages || [];

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
         submitLabel={textResources.getText('EditCVLanguagesForm.saveButton')}
         initialValues={{ cv_languages: languages.map(lang => lang.id) }}
         editMode
      >
         <FormCheckboxList
            fieldName="cv_languages"
            loadOptions={async () => await loadLanguagesOptions(ajax, textResources.currentLanguage)}
         />
      </Form>
   );
}
