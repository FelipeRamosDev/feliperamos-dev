import { useExperienceDetails } from '@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext';
import { Form } from '@/hooks';
import FormMultiSelectChip from '@/hooks/Form/inputs/FormMultiSelectChip';
import { handleSkillsLoadOptions } from '../CreateExperienceForm/CreateExperienceForm.config';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { ExperienceData } from '@/types/database.types';
import { handleExperienceUpdate } from '@/helpers/database.helpers';
import texts from './EditExperienceSkills.text';

export default function EditExperienceSkills() {
   const experience = useExperienceDetails();
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);

   const handleSubmit = async (values: Partial<ExperienceData>) => await handleExperienceUpdate(ajax, experience, values);

   return (
      <Form
         initialValues={{ skills: experience.skills.map(skill => skill.id) }}
         submitLabel={textResources.getText('EditExperienceSkills.submit.label')}
         onSubmit={handleSubmit}
         editMode
      >
         <FormMultiSelectChip
            fieldName="skills"
            loadOptions={() => handleSkillsLoadOptions(ajax, textResources)}
         />
      </Form>
   );
}
