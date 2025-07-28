import { Card } from '@/components/common';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import { Fragment, useState } from 'react';
import { useCompanyDetails } from '../CompanyDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CompanyDetailsContent.text';
import { Form, FormSubmit } from '@/hooks';
import { useAjax } from '@/hooks/useAjax';
import { useRouter } from 'next/navigation';


export default function CompanyDetailsSidebar(): React.ReactElement {
   const [ deleteLoading, setDeleteLoading ] = useState<boolean>(false);
   const company = useCompanyDetails();
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const router = useRouter();

   const handleDelete = async () => {
      const confirmed = confirm(textResources.getText('CompanyDetailsContent.confirmDelete'));

      if (!confirmed) {
         return { success: true };
      }

      try {
         setDeleteLoading(true);
         const deleted = await ajax.post('/company/delete', { companyId: company?.id });
         if (!deleted.success) {
            return deleted;
         }

         router.push('/admin');
         return deleted;
      } catch (error) {
         throw error;
      } finally {
         setDeleteLoading(false);
      }
   }

   return (
      <Fragment>
         <Card padding="l">
            <DataContainer>
               <label>{textResources.getText('CompanyDetailsContent.label.id')}</label>
               <span>{company?.id}</span>
            </DataContainer>
            <DataContainer>
               <label>{textResources.getText('CompanyDetailsContent.label.createdAt')}</label>
               <span>{new Date(company?.created_at).toLocaleString()}</span>
            </DataContainer>
         </Card>

         <Card padding="l">
            <Form hideSubmit onSubmit={handleDelete}>
               <FormSubmit
                  color="error"
                  label={textResources.getText('CompanyDetailsContent.button.delete')}
                  loading={deleteLoading}
               />
            </Form>
         </Card>
      </Fragment>
   );
}
