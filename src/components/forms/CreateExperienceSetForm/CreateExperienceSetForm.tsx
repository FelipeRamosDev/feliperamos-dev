import { Form, FormInput } from '@/hooks';
import { languagesOptions } from './CreateExperienceSetForm.config';
import { useAjax } from '@/hooks/useAjax';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { CreateExperienceSetFormProps } from './CreateExperienceSetForm.types';
import { ExperienceSetData } from '@/types/database.types';
import { FormValues } from '@/hooks/Form/Form.types';

export default function CreateExperienceSetForm({ experienceId }: CreateExperienceSetFormProps): React.ReactElement {
   const ajax = useAjax();

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
         <FormSelect fieldName="language_set" label="Language" options={languagesOptions} />

         <FormInput fieldName="slug" label="Slug" parseInput={(value: string | number) => String(value).toLowerCase().replace(/\s+/g, '-')} />
         <FormInput fieldName="position" label="Position" />
         <FormInput fieldName="summary" label="Summary" multiline />
         <FormInput fieldName="description" label="Description" multiline minRows={10} />
         <FormInput fieldName="responsibilities" label="Responsibilities" multiline />
      </Form>
   );
}
