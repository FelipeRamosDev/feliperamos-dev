import { Form } from '@/hooks';
import FormCheckboxList from '@/hooks/Form/inputs/FormCheckboxList';
import { loadExperiencesListOptions } from '@/helpers/database.helpers';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useCVDetails } from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';
import { CVData } from '@/types/database.types';
import texts from './EditCVExperiencesForm.text';
import { FormValues } from '@/hooks/Form/Form.types';

export default function EditCVExperiencesForm(): React.ReactElement {
   const { textResources } = useTextResources(texts);
   const cv = useCVDetails();
   const ajax = useAjax();
   const parsedIDs = cv?.cv_experiences?.map(exp => exp.id) ?? [];

   const handleSubmit = async (data: FormValues) => {
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
      <Form
         submitLabel={textResources.getText('CVExperiences.submitButton')}
         initialValues={{ cv_experiences: parsedIDs }}
         editMode onSubmit={handleSubmit}
      >
         <FormCheckboxList
            fieldName="cv_experiences"
            loadOptions={() => loadExperiencesListOptions(ajax, textResources.currentLanguage)}
         />
      </Form>
   );
}
