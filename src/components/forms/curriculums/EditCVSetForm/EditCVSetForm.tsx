import { allowedLanguages, languageNames } from '@/app.config';
import { useCVDetails } from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';
import { Form, FormInput, FormSelect } from '@/hooks';
import { useAjax } from '@/hooks/useAjax';
import { CVSetData } from '@/types/database.types';
import EditCVSetFormProps from './EditCVSetForm.types';

export default function EditCVSetForm({ editMode, language_set }: EditCVSetFormProps): React.JSX.Element {
   const cv = useCVDetails();
   const ajax = useAjax();
   const languageSet: CVSetData | undefined = cv.languageSets.find(set => set.language_set === language_set);
   const initialValues = editMode ? Object(languageSet) : { cv_id: cv.id };

   const languagesOptions = allowedLanguages.map(lang => ({
      value: lang,
      label: languageNames[lang]
   }));

   const handleSubmit = async (data: any) => {
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
      <Form submitLabel="Save Changes" initialValues={initialValues} editMode={editMode} onSubmit={handleSubmit}>
         {!editMode && <FormSelect
            fieldName="language_set"
            label="Language Set"
            options={languagesOptions}
         />}

         <FormInput
            fieldName="job_title"
            label="Job Title"
            placeholder="Enter Job Title"
         />
         <FormInput
            fieldName="summary"
            label="Summary"
            placeholder="Enter Summary"
            multiline
            minRows={5}
         />
      </Form>
   );
}
