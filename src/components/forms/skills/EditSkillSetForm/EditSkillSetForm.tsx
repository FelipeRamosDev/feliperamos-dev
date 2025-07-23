import { allowedLanguages, languageNames } from '@/app.config';
import { useSkillDetails } from '@/components/content/admin/skill/SkillDetailsContent/SkillDetailsContext';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { useAjax } from '@/hooks/useAjax';
import { SkillData, SkillSetData } from '@/types/database.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditSkillSetForm.text';

export default function EditSkillSetForm({ editMode, language_set }: { editMode?: boolean, language_set?: string }): React.ReactElement {
   const skill = useSkillDetails();
   const languageSet = skill.languageSets.find((set: SkillData) => set.language_set === language_set);
   const initialValues = editMode ? Object(languageSet) : { skill_id: skill.id };
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);

   const languagesOptions = allowedLanguages.map(lang => ({
      value: lang,
      label: languageNames[lang]
   }));

   if (!languageSet && editMode) {
      return <div>{textResources.getText('EditSkillSetForm.feedback.notFound')}</div>;
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
      <Form
         initialValues={initialValues}
         submitLabel={textResources.getText('EditSkillSetForm.save')}
         onSubmit={handleSubmit}
         editMode={editMode}
      >
         {!editMode && (
            <FormSelect
               fieldName="language_set"
               label={textResources.getText('EditSkillSetForm.language_set')}
               options={languagesOptions}
            />
         )}

         <FormInput
            fieldName="journey"
            label={textResources.getText('EditSkillSetForm.journey')}
            minRows={10}
            multiline
         />
      </Form>
   );
}
