'use client';

import { Fragment } from 'react';
import { Card } from '@/components/common';
import { ContentSidebar } from '@/components/layout';
import { Form, FormInput } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { CardProps } from '@/components/common/Card/Card.types';
import FormSubmit from '@/hooks/Form/inputs/FormSubmit';
import { useAjax } from '@/hooks/useAjax';
import FormButtonSelect from '@/hooks/Form/inputs/FormButtonSelect';
import FormDatePicker from '@/hooks/Form/inputs/FormDatePicker';
import { CreateExperienceFormProps } from './CreateExperienceForm.types';
import { Save } from '@mui/icons-material';

export default function CreateExperienceForm({ initialValues }: CreateExperienceFormProps): React.ReactElement {
   const ajax = useAjax();

   const INITIAL_VALUES = {
      status: 'draft',
      ...initialValues
   }

   const cardDefaultProps: CardProps = {
      padding: 'l',
      className: 'form-group'
   };

   const createExperience = async (data: FormValues) => {
      try {
         const created = await ajax.post('/experience/create', data);

         if (!created.success) {
            return new Error('Failed to create experience');
         }

         return { success: true };
      } catch (error) {
         return error;
      }
   }

   return (
      <Form
         hideSubmit
         className="CreateExperienceForm"
         onSubmit={createExperience}
         initialValues={INITIAL_VALUES}
      >
         <ContentSidebar>
            <Fragment key="main-content">
               <Card {...cardDefaultProps}>
                  <FormInput fieldName="title" label="Experience Title" />
                  <FormInput fieldName="slug" label="Slug" parseInput={(value: string | number) => String(value).toLowerCase().replace(/\s+/g, '-')} />
                  <FormInput fieldName="position" label="Position" />
                  
                  <FormButtonSelect
                     fieldName="type"
                     label="Work Type"
                     options={[
                        { value: 'contract', label: 'Contract' },
                        { value: 'full_time', label: 'Full Time' },
                        { value: 'part_time', label: 'Part Time' },
                        { value: 'temporary', label: 'Temporary' },
                        { value: 'internship', label: 'Internship' },
                        { value: 'freelance', label: 'Freelance' },
                        { value: 'other', label: 'Other' },
                     ]}
                  />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormInput fieldName="summary" label="Summary" multiline />
                  <FormInput fieldName="description" label="Description" multiline minRows={10} />
               </Card>
            </Fragment>

            <Fragment key="sidebar-content">
               <Card {...cardDefaultProps}>
                  <FormButtonSelect fieldName="status" defaultValue="draft" options={[
                     { value: 'draft', label: 'Draft' },
                     { value: 'publish', label: 'Publish' }
                  ]}/>

                  <FormSubmit label="Save Draft" startIcon={<Save />} />
               </Card>

               <Card {...cardDefaultProps}>
               </Card>

               <Card {...cardDefaultProps}>
                  <FormDatePicker fieldName="start_date" label="Start Date" />
                  <FormDatePicker fieldName="end_date" label="End Date" />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormInput fieldName="responsibilities" label="Responsibilities" multiline />
               </Card>
            </Fragment>
         </ContentSidebar>
      </Form>
   );
}
