import { useEducationDetails } from '@/components/content/admin/education/EducationDetailsContent/EducationDetailsContext';
import { Form, FormInput } from '@/hooks';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditEducationSetForm.texts'
import { useAjax } from '@/hooks/useAjax';
import { FormValues } from '@/hooks/Form/Form.types';

export default function EditEducationSetForm({ language_set }: { language_set: string }) {
   const education = useEducationDetails();
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const languageSet = education.languageSets?.find(set => set.language_set === language_set);

   const handleUpdate = async (values: FormValues) => {
      if (!languageSet) return;

      try {
         const updated = await ajax.patch(`/education/update-set`, { set_id: languageSet.id, updates: values });

         window.location.reload();
         return updated;
      } catch (error) {
         return error;
      }
   }

   return (
      <Form initialValues={{ ...languageSet }} onSubmit={handleUpdate} editMode>
         <FormInput
            fieldName="field_of_study"
            label={textResources.getText('EditEducationSetForm.fields.field_of_study.label')}
            placeholder={textResources.getText('EditEducationSetForm.fields.field_of_study.placeholder')}
         />
         <FormInput
            fieldName="degree"
            label={textResources.getText('EditEducationSetForm.fields.degree.label')}
            placeholder={textResources.getText('EditEducationSetForm.fields.degree.placeholder')}
         />
         <FormInput
            fieldName="grade"
            label={textResources.getText('EditEducationSetForm.fields.grade.label')}
            placeholder={textResources.getText('EditEducationSetForm.fields.grade.placeholder')}
         />
         <FormInput
            fieldName="description"
            minRows={5}
            multiline
            label={textResources.getText('EditEducationSetForm.fields.description.label')}
            placeholder={textResources.getText('EditEducationSetForm.fields.description.placeholder')}
         />
      </Form>
   );
}
