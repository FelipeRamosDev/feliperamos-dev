import { useLanguageDetails } from '@/components/content/admin/language/LanguageDetailsContent/LanguageDetailsContext';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { LanguageData } from '@/types/database.types';
import texts from './EditLanguageDetailsForm.texts';

export default function EditLanguageDetailsForm() {
   const { textResources } = useTextResources(texts);
   const language = useLanguageDetails();
   const ajax = useAjax();

   const handleUpdate = async (values: FormValues) => {
      try {
         const updated = await ajax.patch<LanguageData>('/language/update', { language_id: language.id, updates: values });

         if (!updated.success) {
            throw updated;
         }

         window.location.reload();
         return updated.data;
      } catch (error) {
         return error;
      }
   };

   return (
      <Form initialValues={{...language}} editMode onSubmit={handleUpdate}>
         <FormInput fieldName="default_name" label={textResources.getText('EditLanguageDetailsForm.default_name')} />
         <FormInput fieldName="local_name" label={textResources.getText('EditLanguageDetailsForm.local_name')} />
         <FormInput fieldName="locale_code" label={textResources.getText('EditLanguageDetailsForm.locale_code')} />
      </Form>
   );
}
