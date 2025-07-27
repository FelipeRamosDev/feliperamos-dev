import { Form } from '@/hooks';
import FormCheckboxList from '@/hooks/Form/inputs/FormCheckboxList';
import { loadExperiencesListOptions } from '@/helpers/database.helpers';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useCVDetails } from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';
import { CVData } from '@/types/database.types';

export default function EditCVExperiencesForm(): React.ReactElement {
   const { textResources } = useTextResources();
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
      <Form submitLabel="Save Changes" initialValues={{ cv_experiences: cv?.cv_experiences?.map(exp => exp.id) }} editMode onSubmit={handleSubmit}>
         <FormCheckboxList
            fieldName="cv_experiences"
            loadOptions={() => loadExperiencesListOptions(ajax, textResources.currentLanguage)}
         />
      </Form>
   );
}
