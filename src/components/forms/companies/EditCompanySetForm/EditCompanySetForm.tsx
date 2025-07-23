import { allowedLanguages, languageNames } from '@/app.config';
import { useCompanyDetails } from '@/components/content/admin/company/CompanyDetailsContent/CompanyDetailsContext';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { CompanySetData } from '@/types/database.types';
import texts from './EditCompanySetForm.text';

export default function EditCompanySetForm({ language_set, editMode }: { language_set?: string, editMode?: boolean }): React.JSX.Element {
   const company = useCompanyDetails();
   const languageSet = company.languageSets.find(set => set.language_set === language_set);
   const initialValues = editMode ? Object(languageSet) : { company_id: company.id };
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);

   const languagesOptions = allowedLanguages.map(lang => ({
      value: lang,
      label: languageNames[lang]
   }));

   if (!languageSet && editMode) {
      return <div>Language set not found</div>;
   }

   const handleSubmit = async (values: FormValues) => {
      if (!editMode) {
         try {
            const created = await ajax.post<CompanySetData>('/company/create-set', values);

            if (!created.success) {
               throw created;
            }

            window.location.reload();
            return { success: true };
         } catch (error) {
            console.error('Error creating company set:', error);
            return error;
         }
      } else {
         try {
            const updated = await ajax.post<CompanySetData>('/company/update-set', {
               id: languageSet?.id,
               updates: values
            });
   
            if (!updated.success) {
               throw updated;
            }
   
            window.location.reload();
            return { success: true };
         } catch (error) {
            console.error('Error saving company set:', error);
            return error;
         }
      }
   }

   return (
      <Form
         initialValues={initialValues}
         submitLabel={textResources.getText('EditCompanySetForm.submitButton')}
         onSubmit={handleSubmit}
         editMode={editMode}
      >
         {!editMode && (
            <FormSelect
               fieldName="language_set"
               label={textResources.getText('EditCompanySetForm.language.label')}
               options={languagesOptions}
            />
         )}

         <FormInput
            fieldName="industry"
            label={textResources.getText('EditCompanySetForm.industry.label')}
            placeholder={textResources.getText('EditCompanySetForm.industry.placeholder')}
         />
         <FormInput
            fieldName="description"
            label={textResources.getText('EditCompanySetForm.description.label')}
            placeholder={textResources.getText('EditCompanySetForm.description.placeholder')}
            minRows={10}
            multiline
         />
      </Form>
   );
}
