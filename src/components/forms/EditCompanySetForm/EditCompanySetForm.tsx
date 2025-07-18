import { allowedLanguages, languageNames } from '@/app.config';
import { useCompanyDetails } from '@/components/content/admin/company/CompanyDetailsContent/CompanyDetailsContext';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { useAjax } from '@/hooks/useAjax';
import { CompanySetData } from '@/types/database.types';

export default function EditCompanySetForm({ language_set, editMode }: { language_set?: string, editMode?: boolean }): React.JSX.Element {
   const company = useCompanyDetails();
   const languageSet = company.languageSets.find(set => set.language_set === language_set);
   const initialValues = editMode ? Object(languageSet) : { company_id: company.id };
   const ajax = useAjax();

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
      <Form initialValues={initialValues} submitLabel="Save Changes" onSubmit={handleSubmit} editMode={editMode}>
         {!editMode && (
            <FormSelect fieldName="language_set" label="Language" options={languagesOptions} />
         )}

         <FormInput fieldName="industry" label="Industry" />
         <FormInput fieldName="description" label="Description" minRows={10} multiline />
      </Form>
   );
}
