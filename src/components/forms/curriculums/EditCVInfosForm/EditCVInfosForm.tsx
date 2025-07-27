import { useCVDetails } from "@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext";
import { Form, FormInput } from "@/hooks";
import { useAjax } from "@/hooks/useAjax";
import { CVData } from "@/types/database.types";

export default function EditCVInfosForm() {
   const cv = useCVDetails();
   const ajax = useAjax();

   const handleSubmit = async (data: any) => {
      try {
         const updatedCV = await ajax.post<CVData>('/curriculum/update', { id: cv.id, updates: data });

         if (!updatedCV.success) {
            throw updatedCV;
         }

         window.location.reload();
         return updatedCV;
      } catch (error) {
         throw error;
      }
   }

   return (
      <Form submitLabel="Save Changes" initialValues={{ ...cv }} editMode onSubmit={handleSubmit}>
         <FormInput
            fieldName="title"
            label="CV Title"
            placeholder="Enter CV Title"
         />
         <FormInput
            fieldName="notes"
            label="Reference Notes"
            placeholder="Enter Reference Notes"
            multiline
            minRows={3}
         />
      </Form>
   );
}
