import { ContentSidebar } from '@/components/layout';
import { Form, FormInput } from '@/hooks';
import FormSubmit from '@/hooks/Form/inputs/FormSubmit';
import { Fragment } from 'react';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { Card } from '@/components/common';
import { useRouter } from 'next/navigation';


export default function CreateCompanyForm() {
   const ajax = useAjax();
   const route = useRouter();

   const GroupCard = ({ children }: { children: React.ReactNode }) => (
      <Card className="group-card" padding="m">
         {children}
      </Card>
   );

   const handleSubmit = async (data: FormValues) => {
      try {
         const created = await ajax.post('/company/create', data);

         if (!created.success) {
            throw new Error(created.message || 'Failed to create company');
         }

         route.push('/admin');
         return { success: true };
      } catch (error) {
         throw new Error('Failed to create company');
      }
   };

   return (
      <Form hideSubmit onSubmit={handleSubmit}>
         <ContentSidebar>
            <Fragment>
               <GroupCard>
                  <FormInput fieldName="company_name" label="Company Name" />
                  <FormInput fieldName="site_url" label="Company's Website URL" />
               </GroupCard>

               <GroupCard>
                  <FormInput fieldName="industry" label="Industry Type" />
                  <FormInput fieldName="description" label="Company Description" multiline />
               </GroupCard>
            </Fragment>

            <Fragment>
               <GroupCard>
                  <FormSubmit fullWidth />
               </GroupCard>
               <GroupCard>
                  <FormInput fieldName="logo_url" label="Company's Logo URL" />
                  <FormInput fieldName="location" label="Company's Location" />
               </GroupCard>
            </Fragment>
         </ContentSidebar>
      </Form>
   );
}
