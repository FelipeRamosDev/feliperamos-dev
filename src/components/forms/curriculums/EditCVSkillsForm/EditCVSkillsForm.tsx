import { useCVDetails } from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';
import { loadSkillsOptions } from '@/helpers/database.helpers';
import { Form, FormMultiSelectChip } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditCVSkillsForm.text';

export default function EditCVSkillsForm() {
   const { textResources } = useTextResources(texts);
   const cv = useCVDetails();
   const ajax = useAjax();
   const parsedIDs = (cv.cv_skills ?? []).map(skill => skill.id);

   const handleSubmit = async (data: FormValues) => {
      try {
         const updatedSkills = await ajax.post('curriculum/update', { id: cv.id, updates: data });

         if (!updatedSkills.success) {
            throw updatedSkills;
         }

         window.location.reload();
         return updatedSkills;
      } catch (error) {
         throw error;
      }  
   }

   return (
      <Form
         submitLabel={textResources.getText('EditCVSkillsForm.submitButton')}
         initialValues={{ cv_skills: parsedIDs }}
         onSubmit={handleSubmit}
         editMode
      >
         <FormMultiSelectChip
            fieldName="cv_skills"
            label={textResources.getText('EditCVSkillsForm.field.cv_skills.label')}
            loadOptions={() => loadSkillsOptions(ajax, textResources)}
         />
      </Form>
   );
}
