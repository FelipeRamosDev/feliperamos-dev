'use client';

import { Card } from '@/components/common';
import { CardProps } from '@/components/common/Card/Card.types';
import { ContentSidebar } from '@/components/layout';
import { Form, FormInput, FormMultiSelectChip, FormSubmit } from '@/hooks';
import { FormValues } from '@/hooks/Form/Form.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { Save } from '@mui/icons-material';
import { Fragment } from 'react';
import texts from './CreateCurriculumForm.text';
import { useAjax } from '@/hooks/useAjax';
import { CVData } from '@/types/database.types';
import { useRouter } from 'next/navigation';
import FormCheckSwitch from '@/hooks/Form/inputs/FormCheckSwitch';
import FormCheckboxList from '@/hooks/Form/inputs/FormCheckboxList';
import { loadExperiencesListOptions, loadSkillsOptions } from '@/helpers/database.helpers';

export default function CreateCurriculumForm() {
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const router = useRouter();

   const cardProps: CardProps = { padding: 'm' }

   const handleSubmit = async (data: FormValues) => {
      try {
         const created = await ajax.post<CVData>('/curriculum/create', data);

         if (!created.success) {
            console.error("Error creating curriculum:", created.message);
            throw created;
         }

         console.log("Curriculum created successfully:", created.data);
         router.push(`/admin/curriculum/${created.data.id}`);
         return { success: true };
      } catch (error) {
         console.error("Error creating curriculum:", error);
         throw error;
      }
   }

   return (
      <Form hideSubmit onSubmit={handleSubmit}>
         <ContentSidebar>
            <Fragment>
               <Card {...cardProps}>
                  <FormInput
                     fieldName="title"
                     label={textResources.getText('CreateCurriculumForm.title.label')}
                     placeholder={textResources.getText('CreateCurriculumForm.title.placeholder')}
                  />
               </Card>

               <Card {...cardProps}>
                  <FormInput
                     fieldName="job_title"
                     label={textResources.getText('CreateCurriculumForm.job_title.label')}
                     placeholder={textResources.getText('CreateCurriculumForm.job_title.placeholder')}
                  />
                  <FormInput
                     fieldName="experience_time"
                     type="number"
                     label={textResources.getText('CreateCurriculumForm.experienceTime.label')}
                     placeholder={textResources.getText('CreateCurriculumForm.experienceTime.placeholder')}
                  />
                  <FormInput
                     fieldName="summary"
                     label={textResources.getText('CreateCurriculumForm.summary.label')}
                     placeholder={textResources.getText('CreateCurriculumForm.summary.placeholder')}
                     multiline
                     minRows={5}
                  />
               </Card>

               <Card {...cardProps}>
                  <FormCheckboxList
                     fieldName="cv_experiences"
                     label={textResources.getText('CreateCurriculumForm.cv_experiences.label')}
                     loadOptions={() => loadExperiencesListOptions(ajax, textResources.currentLanguage)}
                  />
               </Card>
            </Fragment>

            <Fragment>
               <Card {...cardProps}>
                  <FormCheckSwitch
                     fieldName="is_master"
                     label={textResources.getText('CreateCurriculumForm.is_master.label')}
                  />
               </Card>
               <Card {...cardProps}>
                  <FormInput
                     fieldName="notes"
                     label={textResources.getText('CreateCurriculumForm.notes.label')}
                     placeholder={textResources.getText('CreateCurriculumForm.notes.placeholder')}
                     multiline
                     minRows={3}
                  />
               </Card>

               <Card {...cardProps}>
                  <FormMultiSelectChip
                     fieldName="cv_skills"
                     label={textResources.getText('CreateCurriculumForm.skills.label')}
                     loadOptions={() => loadSkillsOptions(ajax, textResources)}
                  />
               </Card>

               <Card {...cardProps}>
                  <FormSubmit startIcon={<Save />} label={textResources.getText('CreateCurriculumForm.submit.label')} />
               </Card>
            </Fragment>
         </ContentSidebar>
      </Form>
   );
}
