import { useLanguageDetails } from '@/components/content/admin/language/LanguageDetailsContent/LanguageDetailsContext';
import { Form, FormSelect } from '@/hooks';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditLevelsForm.texts';
import { languageLevels } from '@/app.config';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { LanguageData } from '@/types/database.types';

export default function EditLevelsForm() {
   const language = useLanguageDetails();
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();

   const handleUpdate = async (values: FormValues) => {
      try {
         const updated = await ajax.patch<LanguageData>('/language/update', { language_id: language.id, updates: values });
         if (!updated.success) {
            throw updated;
         }

         window.location.reload();
         return updated;
      } catch (error) {
         return error;
      }
   }

   return (
      <Form initialValues={{...language}} onSubmit={handleUpdate} editMode>
         <FormSelect
            fieldName="proficiency"
            label={textResources.getText('EditLevelsForm.proficiency.label')}
            options={languageLevels}
         />
      </Form>
   );
}
