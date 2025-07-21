import { useExperienceDetails } from '@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext';
import { Form, FormInput } from '@/hooks';
import { ExperienceSetData } from '@/types/database.types';
import { EditExperienceSetFormProps } from './EditExperienceSetForm.types';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditExperienceSetForm.text';

export default function EditExperienceSetForm({ language_set = 'en' }: EditExperienceSetFormProps): React.ReactElement {
   const ajax = useAjax();
   const experience = useExperienceDetails();
   const languageSet = experience.languageSets.find((set: ExperienceSetData) => set.language_set === language_set);
   const { textResources } = useTextResources(texts);

   const handleSubmit = async (values: Partial<ExperienceSetData>) => {
      if (!languageSet) {
         throw new Error('Language set not found');
      }

      try {
         const updatedSet = await ajax.post<ExperienceSetData>('/experience/update-set', { id: languageSet.id, updates: values });

         if (!updatedSet) {
            throw new Error('Failed to update experience set');
         }

         window.location.reload();
         return { success: true };
      } catch (error) {
         throw error;
      }
   };

   return (
      <Form
         initialValues={Object(languageSet)}
         submitLabel={textResources.getText('EditExperienceSetForm.submit.label')}
         onSubmit={handleSubmit}
         editMode
      >
         <FormInput
            fieldName="position"
            label={textResources.getText('EditExperienceSetForm.position.label')}
            placeholder={textResources.getText('EditExperienceSetForm.position.placeholder')}
         />
         <FormInput
            fieldName="slug"
            label={textResources.getText('EditExperienceSetForm.slug.label')}
            placeholder={textResources.getText('EditExperienceSetForm.slug.placeholder')}
         />
         <FormInput
            fieldName="summary"
            label={textResources.getText('EditExperienceSetForm.summary.label')}
            placeholder={textResources.getText('EditExperienceSetForm.summary.placeholder')}
            multiline
            minRows={5}
         />
         <FormInput
            fieldName="description"
            label={textResources.getText('EditExperienceSetForm.description.label')}
            placeholder={textResources.getText('EditExperienceSetForm.description.placeholder')}
            multiline
            minRows={10}
         />
         <FormInput
            fieldName="responsibilities"
            label={textResources.getText('EditExperienceSetForm.responsibilities.label')}
            placeholder={textResources.getText('EditExperienceSetForm.responsibilities.placeholder')}
            multiline
            minRows={5}
         />
      </Form>
   );
}
