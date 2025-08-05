import { allowedLanguages, languageNames } from '@/app.config';
import { useCVDetails } from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';
import { Form, FormInput, FormSelect } from '@/hooks';
import { useAjax } from '@/hooks/useAjax';
import { CVSetData } from '@/types/database.types';
import { EditCVSetFormProps } from './EditCVSetForm.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EditCVSetForm.text';
import { FormValues } from '@/hooks/Form/Form.types';

export default function EditCVSetForm({ editMode, language_set }: EditCVSetFormProps): React.JSX.Element {
   const cv = useCVDetails();
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);
   const languageSet: CVSetData | undefined = cv.languageSets.find(set => set.language_set === language_set);
   const initialValues = editMode ? Object(languageSet) : { cv_id: cv.id };

   const languagesOptions = allowedLanguages.map(lang => ({
      value: lang,
      label: languageNames[lang]
   }));

   const handleSubmit = async (data: FormValues) => {
      try {
         if (!editMode) {
            const createdCVSet = await ajax.post<CVSetData>('/curriculum/create-set', data);

            if (!createdCVSet.success) {
               throw createdCVSet;
            }

            window.location.reload();
            return createdCVSet;
         } else {
            if (!languageSet) {
               throw new Error('Language set not found');
            }

            const updatedCV = await ajax.post<CVSetData>('/curriculum/update-set', { id: languageSet.id, updates: data });
            if (!updatedCV.success) {
               throw updatedCV;
            }

            window.location.reload();
            return updatedCV;
         }
      } catch (error) {
         throw error;
      }
   }

   return (
      <Form submitLabel={textResources.getText('EditCVSetForm.submitButton')} initialValues={initialValues} editMode={editMode} onSubmit={handleSubmit}>
         {!editMode && <FormSelect
            fieldName="language_set"
            label={textResources.getText('EditCVSetForm.field.language_set.label')}
            options={languagesOptions}
         />}

         <FormInput
            fieldName="job_title"
            label={textResources.getText('EditCVSetForm.field.job_title.label')}
            placeholder={textResources.getText('EditCVSetForm.field.job_title.placeholder')}
         />
         <FormInput
            fieldName="sub_title"
            label={textResources.getText('EditCVSetForm.field.sub_title.label')}
            placeholder={textResources.getText('EditCVSetForm.field.sub_title.placeholder')}
         />
         <FormInput
            fieldName="summary"
            label={textResources.getText('EditCVSetForm.field.summary.label')}
            placeholder={textResources.getText('EditCVSetForm.field.summary.placeholder')}
            multiline
            minRows={5}
         />
      </Form>
   );
}
