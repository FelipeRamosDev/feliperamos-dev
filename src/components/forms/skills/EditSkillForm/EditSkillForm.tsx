import { skillCategories } from '@/app.config';
import { useSkillDetails } from '@/components/content/admin/skill/SkillDetailsContent/SkillDetailsContext';
import { Form, FormInput, FormSelect } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { SkillData } from '@/types/database.types';
import texts from './EditSkillForm.text';

export default function EditSkillForm(): React.ReactElement {
   const skill = useSkillDetails();
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);

   const handleSubmit = async (values: FormValues) => {
      try {
         const response = await ajax.post<SkillData>('/skill/update', { id: skill.id, updates: values });

         if (!response.success) {
            throw response;
         }

         window.location.reload();
         return { success: true };
      } catch (error) {
         console.error('Error updating skill:', error);
         return error;
      }
   }

   return (
      <Form initialValues={Object(skill)} onSubmit={handleSubmit} editMode>
         <FormInput
            fieldName="name"
            label={textResources.getText('EditSkillForm.name')}
         />
         <FormSelect
            fieldName="category"
            label={textResources.getText('EditSkillForm.category')}
            options={skillCategories}
         />
         <FormInput
            fieldName="level"
            type="number"
            label={textResources.getText('EditSkillForm.level')}
         />
      </Form>
   );
}
