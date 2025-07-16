'use client';

import { Fragment } from 'react';
import { Card } from '@/components/common';
import { ContentSidebar } from '@/components/layout';
import { Form, FormInput } from '@/hooks';
import FormSubmit from '@/hooks/Form/inputs/FormSubmit';
import FormButtonSelect from '@/hooks/Form/inputs/FormButtonSelect';
import FormDatePicker from '@/hooks/Form/inputs/FormDatePicker';
import { CreateExperienceFormProps } from './CreateExperienceForm.types';
import { Save } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import FormSelect from '@/hooks/Form/inputs/FormSelect';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { cardDefaultProps, createExperience, handleExperienceLoadOptions, handleSkillsLoadOptions, INITIAL_VALUES, statusOptions, typeOptions } from './CreateExperienceForm.config';
import { useAjax } from '@/hooks/useAjax';
import FormMultiSelectChip from '@/hooks/Form/inputs/FormMultiSelectChip';
import { SkillObj } from '@/components/widgets/SkillsWidget/SkillsWidget.types';

export default function CreateExperienceForm({ initialValues = {} }: CreateExperienceFormProps): React.ReactElement {
   const { textResources } = useTextResources();
   const router = useRouter();
   const ajax = useAjax();

   return (
      <Form
         hideSubmit
         className="CreateExperienceForm"
         onSubmit={(data) => createExperience(data, ajax, router)}
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
                     loadOptions={() => handleExperienceLoadOptions(ajax, textResources)}
                     disableNone
                  />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormMultiSelectChip
                     fieldName="skills"
                     label="Skills"
                     loadOptions={() => handleSkillsLoadOptions(ajax, textResources)}
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
