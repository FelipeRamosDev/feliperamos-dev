'use client';

import { Fragment } from 'react';
import { Card } from '@/components/common';
import { ContentSidebar } from '@/components/layout';
import { Form, FormInput } from '@/hooks';
import FormSubmit from '@/hooks/Form/inputs/FormSubmit';
import FormButtonSelect from '@/hooks/Form/inputs/FormButtonSelect';
import FormDatePicker from '@/hooks/Form/inputs/FormDatePicker';
import { CreateExperienceFormProps, ExperienceCompanyProps } from './CreateExperienceForm.types';
import { Save } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { cardDefaultProps, createExperience, handleLoadOptions, INITIAL_VALUES, statusOptions, typeOptions } from './CreateExperienceForm.config';

export default function CreateExperienceForm({ initialValues = {} }: CreateExperienceFormProps): React.ReactElement {
   const router = useRouter();
   const { textResources } = useTextResources();

   return (
      <Form
         hideSubmit
         className="CreateExperienceForm"
         onSubmit={(data) => createExperience(data, router)}
         initialValues={INITIAL_VALUES(initialValues)}
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
                     options={typeOptions}
                  />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormInput fieldName="summary" label="Summary" multiline />
                  <FormInput fieldName="description" label="Description" multiline minRows={10} />
               </Card>
            </Fragment>

            <Fragment key="sidebar-content">
               <Card {...cardDefaultProps}>
                  <FormButtonSelect
                     fieldName="status"
                     defaultValue="draft"
                     options={statusOptions}
                  />

                  <FormSubmit label="Save Draft" startIcon={<Save />} />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormSelect
                     fieldName="company_id"
                     label="Company"
                     loadOptions={() => handleLoadOptions(textResources)}
                     disableNone
                  />
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
