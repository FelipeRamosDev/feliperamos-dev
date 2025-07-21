import { useCompanyDetails } from '@/components/content/admin/company/CompanyDetailsContent/CompanyDetailsContext';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { CompanyData } from '@/types/database.types';
import texts from './EditCompanyInfo.text';

export default function EditCompanyInfo(): React.JSX.Element {
   const company = useCompanyDetails();
   const ajax = useAjax();
   const { textResources } = useTextResources(texts);

   const handleSubmit = async (data: FormValues) => {
      try {
         const updated = await ajax.post<CompanyData>('/company/update', {
            id: company.id,
            updates: data,
         });

         if (!updated?.success) {
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
      <Form initialValues={Object(company)} submitLabel={textResources.getText('EditCompanyInfo.submitButton')} onSubmit={handleSubmit} editMode>
         <FormInput fieldName="company_name" label={textResources.getText('EditCompanyInfo.companyName')} />
         <FormInput fieldName="location" label={textResources.getText('EditCompanyInfo.location')} />
         <FormInput fieldName="logo_url" label={textResources.getText('EditCompanyInfo.logoUrl')} />
         <FormInput fieldName="site_url" label={textResources.getText('EditCompanyInfo.siteUrl')} />
      </Form>
   );
}
