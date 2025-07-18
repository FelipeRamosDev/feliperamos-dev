import { useExperienceDetails } from '@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext';
import { Form, FormInput } from '@/hooks';
import { ExperienceSetData } from '@/types/database.types';
import { EditExperienceSetFormProps } from './EditExperienceSetForm.types';
import { useAjax } from '@/hooks/useAjax';

export default function EditExperienceSetForm({ language_set = 'en' }: EditExperienceSetFormProps): React.ReactElement {
   const ajax = useAjax();
   const experience = useExperienceDetails();
   const languageSet = experience.languageSets.find((set: ExperienceSetData) => set.language_set === language_set);

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
      <Form initialValues={Object(languageSet)} submitLabel="Save Changes" onSubmit={handleSubmit} editMode>
         <FormInput fieldName="position" label="Position" />
         <FormInput fieldName="slug" label="Slug" />
         <FormInput fieldName="summary" label="Summary" multiline minRows={5} />
         <FormInput fieldName="description" label="Description" multiline minRows={10} />
         <FormInput fieldName="responsibilities" label="Responsibilities" multiline minRows={5} />
      </Form>
   );
}
