'use client';

import { Fragment } from 'react';
import { ContentSidebar } from '@/components/layout';
import { Form, FormInput } from '@/hooks';
import { Card } from '@/components/common';
import FormSubmit from '@/hooks/Form/inputs/FormSubmit';
import { Save } from '@mui/icons-material';
import { CardProps } from '@/components/common/Card/Card.types';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { useAjax } from '@/hooks/useAjax';
import { useRouter } from 'next/navigation';

export default function CreateSkillForm() {
   const cardConfig: CardProps = { padding: 'm' };
   const ajax = useAjax();
   const router = useRouter();

   const createSkillAction = async (data: any) => {
      try {
         const response = await ajax.post('/skill/create', data);
   
         if (!response.success) {
            throw new Error('Failed to create skill');
         }
   
         router.push('/admin')
         return response;
      } catch (error) {
         console.error('Error creating skill:', error);
         throw error;
      }
   };

   return (
      <Form hideSubmit onSubmit={createSkillAction}>
         <ContentSidebar>
            <Fragment>
               <Card {...cardConfig}>
                  <FormInput fieldName="name" label="Skill Name" />
               </Card>
               <Card {...cardConfig}>
                  <FormInput fieldName="journey" label="Skill Journey" multiline minRows={5} />
               </Card>
            </Fragment>
            <Fragment>
               <Card {...cardConfig}>
                  <FormSelect
                     fieldName="category"
                     label="Skill Category"
                     options={[
                        { value: 'languages', label: 'Programming Languages' },
                        { value: 'frameworks', label: 'Frameworks' },
                        { value: 'tools', label: 'Development Tools' },
                        { value: 'databases', label: 'Databases' },
                        { value: 'cloud', label: 'Cloud Services' },
                        { value: 'other', label: 'Other' }
                     ]}
                  />

                  <FormInput fieldName="level" label="Skill Level" type="number" min={1} max={10} />
               </Card>
               
               <Card {...cardConfig}>
                  <FormSubmit startIcon={<Save />} fullWidth />
               </Card>
            </Fragment>
         </ContentSidebar>
      </Form>
   );
}