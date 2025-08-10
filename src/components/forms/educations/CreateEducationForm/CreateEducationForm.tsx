import { Fragment } from 'react';
import { Card, Container } from '@/components/common';
import { ContentSidebar } from '@/components/layout';
import { Form, FormDatePicker, FormInput, FormSubmit } from '@/hooks';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './CreateEducationForm.texts';
import { CardProps } from '@/components/common/Card/Card.types';
import { WidgetHeader } from '@/components/headers';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { EducationData } from '@/types/database.types';
import { useRouter } from 'next/navigation';

export default function CreateEducationForm() {
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const cardProps: CardProps = { padding: 'm' };
   const router = useRouter();

   const handleSubmit = async (values: FormValues) => {
      try {
         const created = await ajax.post<EducationData>('/education/create', values);

         if (created.error) {
            throw created;
         }

         router.push(`/admin/education/${created.data.id}`);
         return created;
      } catch (error) {
         return error;
      }
   }

   return (
      <Form hideSubmit onSubmit={handleSubmit}>
         <Container>
            <ContentSidebar>
               <Fragment>
                  <WidgetHeader title={textResources.getText('CreateEducationForm.sectionDetails.title')} />

                  <Card {...cardProps}>
                     <FormInput
                        fieldName="institution_name"
                        label={textResources.getText('CreateEducationForm.field.institutionName.label')}
                        placeholder={textResources.getText('CreateEducationForm.field.institutionName.placeholder')}
                     />
                     <FormInput
                        fieldName="field_of_study"
                        label={textResources.getText('CreateEducationForm.field.fieldOfStudy.label')}
                        placeholder={textResources.getText('CreateEducationForm.field.fieldOfStudy.placeholder')}
                     />
                     <FormInput
                        fieldName="degree"
                        label={textResources.getText('CreateEducationForm.field.degree.label')}
                        placeholder={textResources.getText('CreateEducationForm.field.degree.placeholder')}
                     />
                     <FormInput
                        fieldName="grade"
                        label={textResources.getText('CreateEducationForm.field.grade.label')}
                        placeholder={textResources.getText('CreateEducationForm.field.grade.placeholder')}
                     />
                     <FormInput
                        fieldName="description"
                        label={textResources.getText('CreateEducationForm.field.description.label')}
                        placeholder={textResources.getText('CreateEducationForm.field.description.placeholder')}
                        minRows={5}
                        multiline
                     />
                  </Card>
               </Fragment>

               <Fragment>
                  <WidgetHeader title={textResources.getText('CreateEducationForm.sectionPeriod.title')} />
                  <Card {...cardProps}>
                     <FormDatePicker
                        fieldName="start_date"
                        label={textResources.getText('CreateEducationForm.field.startDate.label')}
                     />
                     <FormDatePicker
                        fieldName="end_date"
                        label={textResources.getText('CreateEducationForm.field.endDate.label')}
                     />
                  </Card>

                  <Card {...cardProps}>
                     <FormSubmit label={textResources.getText('CreateEducationForm.field.submit.label')} />
                  </Card>
               </Fragment>
            </ContentSidebar>
         </Container>
      </Form>
   );
}
