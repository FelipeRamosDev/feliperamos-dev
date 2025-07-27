import { useCVDetails } from "@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext";
import { loadSkillsOptions } from "@/helpers/database.helpers";
import { Form, FormMultiSelectChip } from "@/hooks";
import { FormValues } from "@/hooks/Form/Form.types";
import { useAjax } from "@/hooks/useAjax";
import { useTextResources } from "@/services/TextResources/TextResourcesProvider";

export default function EditCVSkillsForm() {
   const { textResources } = useTextResources();
   const cv = useCVDetails();
   const ajax = useAjax();

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
      <Form submitLabel="Save Changes" initialValues={{ cv_skills: cv.cv_skills?.map(skill => skill.id) }} editMode onSubmit={handleSubmit}>
         <FormMultiSelectChip
            fieldName="cv_skills"
            label="CV Skills"
            loadOptions={() => loadSkillsOptions(ajax, textResources)}
         />
      </Form>
   );
}
