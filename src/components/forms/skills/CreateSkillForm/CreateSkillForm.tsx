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
import { CreateSkillData } from './CreateSkillForm.types';
import { skillCategories } from '@/app.config';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './CreateSkillForm.text';

export default function CreateSkillForm() {
   const cardConfig: CardProps = { padding: 'm' };
   const ajax = useAjax();
   const router = useRouter();
   const { textResources } = useTextResources(texts);

   const handleSubmit = async (values: unknown) => {
      const data: CreateSkillData = {
         name: (values as CreateSkillData).name,
         journey: (values as CreateSkillData).journey,
         category: (values as CreateSkillData).category,
         level: (values as CreateSkillData).level,
      };
      try {
         const response = await ajax.post('/skill/create', data);

         if (!response.success) {
            throw new Error('Failed to create skill');
         }

         router.push('/admin');
         return response;
      } catch (error) {
         console.error('Error creating skill:', error);
         throw error;
      }
   };

   return (
      <Form hideSubmit onSubmit={handleSubmit}>
         <ContentSidebar>
            <Fragment key="main-content">
               <Card {...cardConfig}>
                  <FormInput
                     fieldName="name"
                     label={textResources.getText('CreateSkillForm.name.label')}
                     placeholder={textResources.getText('CreateSkillForm.name.placeholder')}
                  />
               </Card>
               <Card {...cardConfig}>
                  <FormInput
                     fieldName="journey"
                     label={textResources.getText('CreateSkillForm.journey.label')}
                     placeholder={textResources.getText('CreateSkillForm.journey.placeholder')}
                     multiline
                     minRows={5}
                  />
               </Card>
            </Fragment>

            <Fragment key="sidebar-content">
               <Card {...cardConfig}>
                  <FormSelect
                     fieldName="category"
                     label={textResources.getText('CreateSkillForm.category.label')}
                     options={skillCategories}
                  />

                  <FormInput
                     fieldName="level"
                     label={textResources.getText('CreateSkillForm.level.label')}
                     placeholder={textResources.getText('CreateSkillForm.level.placeholder')}
                     type="number"
                     min={1}
                     max={10}
                  />
               </Card>
               
               <Card {...cardConfig}>
                  <FormSubmit
                     label={textResources.getText('CreateSkillForm.submit.label')}
                     startIcon={<Save />}
                     fullWidth
                  />
               </Card>
            </Fragment>
         </ContentSidebar>
      </Form>
   );
}