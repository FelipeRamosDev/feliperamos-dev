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
import texts from './CreateExperienceForm.text';

export default function CreateExperienceForm({ initialValues = {} }: CreateExperienceFormProps): React.ReactElement {
   const { textResources } = useTextResources(texts);
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
                  <FormInput
                     fieldName="title"
                     label={textResources.getText('CreateExperienceForm.title.label')}
                     placeholder={textResources.getText('CreateExperienceForm.title.palaceholder')}
                  />
                  <FormInput
                     fieldName="slug"
                     label={textResources.getText('CreateExperienceForm.slug.label')}
                     placeholder={textResources.getText('CreateExperienceForm.title.palaceholder')}
                     parseInput={(value: string | number) => String(value).toLowerCase().replace(/\s+/g, '-')}
                  />
                  <FormInput
                     fieldName="position"
                     label={textResources.getText('CreateExperienceForm.position.label')}
                     placeholder={textResources.getText('CreateExperienceForm.position.placeholder')}
                  />

                  <FormButtonSelect
                     fieldName="type"
                     label={textResources.getText('CreateExperienceForm.type.label')}
                     options={typeOptions}
                  />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormInput
                     fieldName="summary"
                     label={textResources.getText('CreateExperienceForm.summary.label')}
                     placeholder={textResources.getText('CreateExperienceForm.summary.placeholder')}
                     multiline
                  />
                  <FormInput
                     fieldName="description"
                     label={textResources.getText('CreateExperienceForm.description.label')}
                     placeholder={textResources.getText('CreateExperienceForm.description.placeholder')}
                     multiline
                     minRows={10}
                  />
               </Card>
            </Fragment>

            <Fragment key="sidebar-content">
               <Card {...cardDefaultProps}>
                  <FormButtonSelect
                     fieldName="status"
                     defaultValue="draft"
                     options={statusOptions}
                  />

                  <FormSubmit
                     label={textResources.getText('CreateExperienceForm.submit')}
                     startIcon={<Save />}
                  />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormSelect
                     fieldName="company_id"
                     label={textResources.getText('CreateExperienceForm.company_id.label')}
                     loadOptions={() => handleExperienceLoadOptions(ajax, textResources)}
                     disableNone
                  />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormMultiSelectChip
                     fieldName="skills"
                     label={textResources.getText('CreateExperienceForm.skills.label')}
                     placeholder={textResources.getText('CreateExperienceForm.skills.placeholder')}
                     loadOptions={() => handleSkillsLoadOptions(ajax, textResources)}
                  />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormDatePicker
                     fieldName="start_date"
                     label={textResources.getText('CreateExperienceForm.start_date.label')}
                  />
                  <FormDatePicker
                     fieldName="end_date"
                     label={textResources.getText('CreateExperienceForm.end_date.label')}
                  />
               </Card>

               <Card {...cardDefaultProps}>
                  <FormInput
                     fieldName="responsibilities"
                     label={textResources.getText('CreateExperienceForm.responsibilities.label')}
                     placeholder={textResources.getText('CreateExperienceForm.responsibilities.placeholder')}
                     multiline
                  />
               </Card>
            </Fragment>
         </ContentSidebar>
      </Form>
   );
}
