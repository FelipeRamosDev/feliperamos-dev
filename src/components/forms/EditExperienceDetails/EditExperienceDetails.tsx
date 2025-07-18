import { Form, FormInput } from "@/hooks";
import FormButtonSelect from "@/hooks/Form/inputs/FormButtonSelect";
import FormDatePicker from "@/hooks/Form/inputs/FormDatePicker";
import { handleExperienceLoadOptions, typeOptions } from "../CreateExperienceForm/CreateExperienceForm.config";
import FormSelect from "@/hooks/Form/inputs/FormSelect";
import { useAjax } from "@/hooks/useAjax";
import { useTextResources } from "@/services/TextResources/TextResourcesProvider";
import { useExperienceDetails } from "@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext";
import { ExperienceData } from "@/types/database.types";
import { handleExperienceUpdate } from "@/helpers/database.helpers";

export default function EditExperienceDetails() {
   const ajax = useAjax();
   const { textResources } = useTextResources();
   const experience = useExperienceDetails();

   const handleSubmit = async (values: Partial<ExperienceData>) => await handleExperienceUpdate(ajax, experience, values);

   return (
      <Form initialValues={{ ...experience }} submitLabel="Save" onSubmit={handleSubmit} editMode>
         <FormInput fieldName="title" label="Title" />
         <FormSelect fieldName="company_id" label="Company" loadOptions={() => handleExperienceLoadOptions(ajax, textResources)} />
         <FormButtonSelect fieldName="type" label="Type" options={typeOptions} />
         <FormDatePicker fieldName="start_date" label="Start Date" />
         <FormDatePicker fieldName="end_date" label="End Date" />
      </Form>
   );
}