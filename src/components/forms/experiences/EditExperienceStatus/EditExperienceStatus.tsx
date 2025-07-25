import { Form } from '@/hooks';
import { statusOptions } from '../CreateExperienceForm/CreateExperienceForm.config';
import FormButtonSelect from '@/hooks/Form/inputs/FormButtonSelect';
import { useExperienceDetails } from '@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext';
import { ExperienceData, ExperienceDataStatus } from '@/types/database.types';
import { handleExperienceUpdate } from '@/helpers/database.helpers';
import { useAjax } from '@/hooks/useAjax';

export default function EditExperienceStatus() {
   const experience = useExperienceDetails();
   const ajax = useAjax();

   const handleSubmit = async (values: Partial<ExperienceData>) => {
      return await handleExperienceUpdate(ajax, experience, values);
   };

   const handleSelect = async (value: string | number) => {
      try {
         await handleSubmit({ status: value as ExperienceDataStatus });
      } catch (error) {
         console.error('Error updating experience status:', error);
      }
   };

   return (
      <Form
         initialValues={{ status: experience.status }}
         hideSubmit
         editMode
      >
         <FormButtonSelect
            fieldName="status"
            options={statusOptions}
            onSelect={handleSelect}
         />
      </Form>
   );
}
