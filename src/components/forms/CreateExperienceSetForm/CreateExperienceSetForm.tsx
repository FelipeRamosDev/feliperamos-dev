import { Form, FormInput } from '@/hooks';
import { languagesOptions } from './CreateExperienceSetForm.config';
import { useAjax } from '@/hooks/useAjax';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { CreateExperienceSetFormProps } from './CreateExperienceSetForm.types';
import { ExperienceSetData } from '@/types/database.types';
import { FormValues } from '@/hooks/Form/Form.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './CreateExperienceSetForm.text';

export default function CreateExperienceSetForm({ experienceId }: CreateExperienceSetFormProps): React.ReactElement {
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);

   const handleSubmit = async (values: FormValues) => {
      try {
         const created = await ajax.post<ExperienceSetData>('/experience/create-set', values);

         if (!created.success) {
            throw new Error('Failed to create experience set');
         }

         window.location.reload();
         return { success: true };
      } catch (error) {
         console.error('Failed to create experience set:', error);
         throw error;
      }
   }

   return (
      <Form
         className="CreateExperienceSetForm"
         initialValues={{ experience_id: experienceId }}
         onSubmit={handleSubmit}
      >
         <FormSelect
            fieldName="language_set"
            label={textResources.getText('CreateExperienceSetForm.language_set.label')}
            options={languagesOptions}
         />

         <FormInput
            fieldName="slug"
            label={textResources.getText('CreateExperienceSetForm.slug.label')}
            placeholder={textResources.getText('CreateExperienceSetForm.slug.placeholder')}
            parseInput={(value: string | number) => String(value).toLowerCase().replace(/\s+/g, '-')}
         />
         <FormInput
            fieldName="position"
            label={textResources.getText('CreateExperienceSetForm.position.label')}
            placeholder={textResources.getText('CreateExperienceSetForm.position.placeholder')}
         />
         <FormInput
            fieldName="summary"
            label={textResources.getText('CreateExperienceSetForm.summary.label')}
            placeholder={textResources.getText('CreateExperienceSetForm.summary.placeholder')}
            multiline
         />
         <FormInput
            fieldName="description"
            label={textResources.getText('CreateExperienceSetForm.description.label')}
            placeholder={textResources.getText('CreateExperienceSetForm.description.placeholder')}
            multiline
            minRows={10}
         />
         <FormInput
            fieldName="responsibilities"
            label={textResources.getText('CreateExperienceSetForm.responsibilities.label')}
            placeholder={textResources.getText('CreateExperienceSetForm.responsibilities.placeholder')}
            multiline
         />
      </Form>
   );
}
