import { ContentSidebar } from '@/components/layout';
import { Form, FormInput } from '@/hooks';
import FormSubmit from '@/hooks/Form/inputs/FormSubmit';
import { Fragment } from 'react';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { Card } from '@/components/common';
import { useRouter } from 'next/navigation';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './CreateCompanyForm.text';

const GroupCard = ({ children }: { children: React.ReactNode }) => (
   <Card className="group-card" padding="m">
      {children}
   </Card>
);

export default function CreateCompanyForm() {
   const ajax = useAjax();
   const route = useRouter();
   const { textResources } = useTextResources(texts);

   const handleSubmit = async (data: FormValues) => {
      try {
         const created = await ajax.post('/company/create', data);

         if (!created.success) {
            throw new Error(created.message || 'Failed to create company');
         }

         route.push('/admin');
         return { success: true };
      } catch {
         throw new Error('Failed to create company');
      }
   };

   return (
      <Form hideSubmit onSubmit={handleSubmit}>
         <ContentSidebar>
            <Fragment>
               <GroupCard>
                  <FormInput
                     fieldName="company_name"
                     label={textResources.getText('CreateCompanyForm.name.label')}
                     placeholder={textResources.getText('CreateCompanyForm.name.placeholder')}
                  />
                  <FormInput
                     fieldName="site_url"
                     label={textResources.getText('CreateCompanyForm.site.label')}
                     placeholder={textResources.getText('CreateCompanyForm.site.placeholder')}
                  />
               </GroupCard>

               <GroupCard>
                  <FormInput
                     fieldName="industry"
                     label={textResources.getText('CreateCompanyForm.industry.label')}
                     placeholder={textResources.getText('CreateCompanyForm.industry.placeholder')}
                  />
                  <FormInput
                     fieldName="description"
                     label={textResources.getText('CreateCompanyForm.description.label')}
                     placeholder={textResources.getText('CreateCompanyForm.description.placeholder')}
                     multiline
                  />
               </GroupCard>
            </Fragment>

            <Fragment>
               <GroupCard>
                  <FormInput
                     fieldName="logo_url"
                     label={textResources.getText('CreateCompanyForm.logo.label')}
                     placeholder={textResources.getText('CreateCompanyForm.logo.placeholder')}
                  />
                  <FormInput
                     fieldName="location"
                     label={textResources.getText('CreateCompanyForm.location.label')}
                     placeholder={textResources.getText('CreateCompanyForm.location.placeholder')}
                  />
               </GroupCard>

               <GroupCard>
                  <FormSubmit fullWidth label={textResources.getText('CreateCompanyForm.submit')} />
               </GroupCard>
            </Fragment>
         </ContentSidebar>
      </Form>
   );
}
