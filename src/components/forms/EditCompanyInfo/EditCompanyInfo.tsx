import { useCompanyDetails } from '@/components/content/admin/company/CompanyDetailsContent/CompanyDetailsContext';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { CompanyData } from '@/types/database.types';

export default function EditCompanyInfo(): React.JSX.Element {
   const company = useCompanyDetails();
   const ajax = useAjax();

   const handleSubmit = async (data: FormValues) => {
      try {
         const updated = await ajax.post<CompanyData>('/company/update', {
            id: company.id,
            updates: data,
         });

         if (!updated) {
            console.error('Company not found or update failed');
            return;
         }

         window.location.reload();
         return { success: true };
      } catch (error) {
         console.error('Error updating company:', error);
      }
   };

   return (
      <Form initialValues={Object(company)} submitLabel="Save Changes" onSubmit={handleSubmit} editMode>
         <FormInput fieldName="company_name" label="Company Name" />
         <FormInput fieldName="location" label="Location" />
         <FormInput fieldName="logo_url" label="Logo URL" />
         <FormInput fieldName="site_url" label="Site URL" />
      </Form>
   );
}
