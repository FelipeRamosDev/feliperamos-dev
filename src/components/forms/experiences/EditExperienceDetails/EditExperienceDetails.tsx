import { Form, FormInput } from '@/hooks';
import FormButtonSelect from '@/hooks/Form/inputs/FormButtonSelect';
import FormDatePicker from '@/hooks/Form/inputs/FormDatePicker';
import { typeOptions } from '../CreateExperienceForm/CreateExperienceForm.config';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useExperienceDetails } from '@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext';
import { ExperienceData } from '@/types/database.types';
import { handleExperienceUpdate, loadCompaniesOptions } from '@/helpers/database.helpers';
import texts from './EditExperienceDetails.text';

export default function EditExperienceDetails() {
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);
   const experience = useExperienceDetails();

   const handleSubmit = async (values: Partial<ExperienceData>) => await handleExperienceUpdate(ajax, experience, values);

   return (
      <Form
         initialValues={{ ...experience }}
         submitLabel="Save"
         onSubmit={handleSubmit}
         editMode
      >
         <FormInput
            fieldName="title"
            label={textResources.getText('EditExperienceDetails.title.label')}
         />
         <FormSelect
            fieldName="company_id"
            label={textResources.getText('EditExperienceDetails.company.label')}
            loadOptions={() => loadCompaniesOptions(ajax, textResources)}
         />
         <FormButtonSelect
            fieldName="type"
            label={textResources.getText('EditExperienceDetails.type.label')}
            options={typeOptions}
         />
         <FormDatePicker
            fieldName="start_date"
            label={textResources.getText('EditExperienceDetails.startDate.label')}
         />
         <FormDatePicker
            fieldName="end_date"
            label={textResources.getText('EditExperienceDetails.endDate.label')}
         />
      </Form>
   );
}