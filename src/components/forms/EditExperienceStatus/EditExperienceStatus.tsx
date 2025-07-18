import { Form } from "@/hooks";
import { statusOptions } from "../CreateExperienceForm/CreateExperienceForm.config";
import FormButtonSelect from "@/hooks/Form/inputs/FormButtonSelect";
import { useExperienceDetails } from "@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext";
import { ExperienceData } from "@/types/database.types";
import { handleExperienceUpdate } from "@/helpers/database.helpers";
import { useAjax } from "@/hooks/useAjax";
import { useRef } from "react";

export default function EditExperienceStatus() {
   const experience = useExperienceDetails();
   const ajax = useAjax();

   const handleSubmit = async (values: Partial<ExperienceData>) => {
      return await handleExperienceUpdate(ajax, experience, values);
   };

   return (
      <Form initialValues={{ status: experience.status }} onSubmit={handleSubmit} submitLabel="Save Status" editMode>
         <FormButtonSelect fieldName="status" options={statusOptions} />
      </Form>
   );
}
