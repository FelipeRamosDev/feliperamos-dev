import { allowedLanguages, languageNames } from '@/app.config';
import { useSkillDetails } from '@/components/content/admin/skill/SkillDetailsContent/SkillDetailsContext';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { useAjax } from '@/hooks/useAjax';
import { SkillData, SkillSetData } from '@/types/database.types';

export default function EditSkillSetForm({ editMode, language_set }: { editMode?: boolean, language_set?: string }): React.ReactElement {
   const skill = useSkillDetails();
   const languageSet = skill.languageSets.find((set: SkillData) => set.language_set === language_set);
   const initialValues = editMode ? Object(languageSet) : { skill_id: skill.id };
   const ajax = useAjax();

   const languagesOptions = allowedLanguages.map(lang => ({
      value: lang,
      label: languageNames[lang]
   }));

   if (!languageSet && editMode) {
      return <div>Language set not found</div>;
   }

   const handleSubmit = async (values: FormValues) => {
      let response;

      try {
         if (editMode) {
            response = await ajax.post<SkillSetData>('/skill/update-set', { id: skill.id, updates: values });
         } else {
            response = await ajax.post<SkillSetData>('/skill/create-set', values);
         }

         if (!response.success) {
            throw response;
         }
   
         window.location.reload();
         return { success: true };
      } catch (error) {
         console.error('Error submitting form:', error);
         return error;
      }
   }

   return (
      <Form initialValues={initialValues} submitLabel="Save" onSubmit={handleSubmit} editMode={editMode}>
         {!editMode && (
            <FormSelect fieldName="language_set" label="Language Set" options={languagesOptions} />
         )}

         <FormInput fieldName="journey" label="Journey Path" minRows={10} multiline />
      </Form>
   );
}
