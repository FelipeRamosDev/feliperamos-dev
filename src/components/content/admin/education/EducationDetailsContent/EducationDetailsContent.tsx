'use client';

import { PageHeader, WidgetHeader } from '@/components/headers';
import { EducationDetailsContentProps } from './EducationDetailsContent.types';
import EducationDetailsProvider from './EducationDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EducationDetailsContent.texts';
import { Card, Container, DateView } from '@/components/common';
import { ContentSidebar, DataContainer } from '@/components/layout';
import { Fragment, useState } from 'react';
import { EditButtons } from '@/components/buttons';
import { CardProps } from '@/components/common/Card/Card.types';
import EducationDetailsSets from './subcomponents/EducationDetailsSets';
import { EditEducationForm } from '@/components/forms/educations';
import { Form, FormSubmit } from '@/hooks';
import { useAjax } from '@/hooks/useAjax';
import { useRouter } from 'next/navigation';

export default function EducationDetailsContent({ education }: EducationDetailsContentProps) {
   const [editDetails, setEditDetails] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const router = useRouter();

   const cardProps: CardProps = { padding: 'm' };

   const handleDeleteEducation = async () => {
      try {
         const deleted = await ajax.delete(`/education/delete`, { data: { education_id: education.id } });

         router.push('/admin');
         return deleted;
      } catch (error) {
         return error;
      }
   }

   return (
      <EducationDetailsProvider education={education}>
         <div className="EducationDetailsContent">
            <PageHeader
               title={textResources.getText('EducationDetailsContent.pageTitle')}
               description={textResources.getText('EducationDetailsContent.pageDescription')}
            />

            <Container>
               <ContentSidebar>
                  <Fragment>
                     <Card {...cardProps}>
                        <WidgetHeader title={textResources.getText('EducationDetailsContent.sectionDetails.title')}>
                           <EditButtons editMode={editDetails} setEditMode={setEditDetails} />
                        </WidgetHeader>

                        {editDetails && (
                           <EditEducationForm />
                        )}

                        {!editDetails && (<>
                           <DataContainer>
                              <label>{textResources.getText('EducationDetailsContent.fields.institution_name.label')}</label>
                              <p>{education.institution_name}</p>
                           </DataContainer>
                           <DataContainer>
                              <label>{textResources.getText('EducationDetailsContent.fields.start_date.label')}</label>
                              <DateView date={education.start_date} />
                           </DataContainer>
                           <DataContainer>
                              <label>{textResources.getText('EducationDetailsContent.fields.end_date.label')}</label>
                              <DateView date={education.end_date} />
                           </DataContainer>
                        </>)}
                     </Card>

                     <EducationDetailsSets cardProps={cardProps} />
                  </Fragment>

                  <Fragment>
                     <Card {...cardProps}>
                        <DataContainer>
                           <label>{textResources.getText('EducationDetailsContent.fields.id.label')}</label>
                           <p>{education.id || textResources.getText('EducationDetailsContent.fields.id.placeholder')}</p>
                        </DataContainer>
                        <DataContainer vertical>
                           <label>{textResources.getText('EducationDetailsContent.fields.created_at.label')}</label>
                           <p>{new Date(education.created_at).toLocaleString()}</p>
                        </DataContainer>
                        <DataContainer vertical>
                           <label>{textResources.getText('EducationDetailsContent.fields.updated_at.label')}</label>
                           <p>{new Date(education.updated_at || '').toLocaleString()}</p>
                        </DataContainer>
                     </Card>

                     <Card {...cardProps}>
                        <Form onSubmit={handleDeleteEducation} hideSubmit>
                           <FormSubmit label={textResources.getText('EducationDetailsContent.deleteButton.label')} color="error" />
                        </Form>
                     </Card>
                  </Fragment>
               </ContentSidebar>
            </Container>
         </div>
      </EducationDetailsProvider>
   );
}
