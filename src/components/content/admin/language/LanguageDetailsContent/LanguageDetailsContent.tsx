'use client';

import { PageHeader, WidgetHeader } from '@/components/headers';
import { LanguageDetailsContentProps } from './LanguageDetailsContent.types';
import LanguageDetailsProvider from './LanguageDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './LanguageDetailsContent.texts';
import { ContentSidebar, DataContainer } from '@/components/layout';
import { Fragment, useState } from 'react';
import { Card, Container } from '@/components/common';
import { CardProps } from '@/components/common/Card/Card.types';
import { EditButtons } from '@/components/buttons';
import EditLanguageDetailsForm from '@/components/forms/languages/EditLanguageDetailsForm/EditLanguageDetailsForm';
import EditLevelsForm from '@/components/forms/languages/EditLevelsForm/EditLevelsForm';
import { Form, FormSubmit } from '@/hooks';
import { Delete } from '@mui/icons-material';
import { useAjax } from '@/hooks/useAjax';
import { useRouter } from 'next/navigation';

export default function LanguageDetailsContent({ language }: LanguageDetailsContentProps) {
   const [ detailsEdit, setDetailEdit ] = useState<boolean>(false);
   const [ levelsEdit, setLevelsEdit ] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const router = useRouter();

   const cardProps: CardProps = { padding: 'm' };

   const handleDelete = async () => {
      if (!window.confirm(textResources.getText('LanguageDetails.deleteConfirm'))) {
         return;
      }

      try {
         const response = await ajax.delete('/language/delete', { data: { language_id: language.id } });
         if (!response.success) {
            throw response;
         }

         router.push('/admin');
         return response;
      } catch (error) {
         console.error('Error deleting language:', error);
      }
   };

   return (
      <LanguageDetailsProvider language={language}>
         <div className="LanguageDetailsContent">
            <PageHeader
               title={textResources.getText('LanguageDetails.headerTitle')}
               description={textResources.getText('LanguageDetails.headerDescription')}
            />

            <Container>
               <ContentSidebar>
                  <Fragment>
                     <WidgetHeader
                        title={textResources.getText('LanguageDetails.detailsHeader.title')}
                     >
                        <EditButtons
                           editMode={detailsEdit}
                           setEditMode={setDetailEdit}
                        />
                     </WidgetHeader>

                     <Card {...cardProps}>
                        {detailsEdit && <EditLanguageDetailsForm />}
                        {!detailsEdit && (
                           <Fragment>
                              <DataContainer>
                                 <label>{textResources.getText('LanguageDetails.field.defaultName')}</label>
                                 <span>{language.default_name}</span>
                              </DataContainer>
                              <DataContainer>
                                 <label>{textResources.getText('LanguageDetails.field.localName')}</label>
                                 <span>{language.local_name}</span>
                              </DataContainer>
                              <DataContainer>
                                 <label>{textResources.getText('LanguageDetails.field.localeCode')}</label>
                                 <span>{language.locale_code}</span>
                              </DataContainer>
                           </Fragment>
                        )}
                     </Card>

                     <WidgetHeader title={textResources.getText('LanguageDetails.levelsHeader.title')}>
                        <EditButtons
                           editMode={levelsEdit}
                           setEditMode={setLevelsEdit}
                        />
                     </WidgetHeader>
                     <Card {...cardProps}>
                        {levelsEdit && <EditLevelsForm />}
                        {!levelsEdit && (
                           <Fragment>
                              <DataContainer vertical>
                                 <label>{textResources.getText('LanguageDetails.field.readingLevel')}</label>
                                 <span>{language.reading_level}</span>
                              </DataContainer>
                              <DataContainer vertical>
                                 <label>{textResources.getText('LanguageDetails.field.writingLevel')}</label>
                                 <span>{language.writing_level}</span>
                              </DataContainer>
                              <DataContainer vertical>
                                 <label>{textResources.getText('LanguageDetails.field.speakingLevel')}</label>
                                 <span>{language.speaking_level}</span>
                              </DataContainer>
                              <DataContainer vertical>
                                 <label>{textResources.getText('LanguageDetails.field.listeningLevel')}</label>
                                 <span>{language.listening_level}</span>
                              </DataContainer>
                           </Fragment>
                        )}
                     </Card>
                  </Fragment>

                  <Fragment>
                     <Card {...cardProps}>
                        <DataContainer>
                           <label>{textResources.getText('LanguageDetails.field.id')}</label>
                           <span>{language.id}</span>
                        </DataContainer>
                        <DataContainer vertical>
                           <label>{textResources.getText('LanguageDetails.field.createdAt')}</label>
                           <span>{new Date(language.created_at).toLocaleString()}</span>
                        </DataContainer>
                        <DataContainer vertical>
                           <label>{textResources.getText('LanguageDetails.field.updatedAt')}</label>
                           {language.updated_at && <span>{new Date(language.updated_at).toLocaleString()}</span>}
                           {!language.updated_at && <span>--</span>}
                        </DataContainer>
                     </Card>

                     <Card {...cardProps}>
                        <Form hideSubmit onSubmit={handleDelete}>
                           <FormSubmit color="error" fullWidth label="Delete Language" startIcon={<Delete />} />
                        </Form>
                     </Card>
                  </Fragment>
               </ContentSidebar>
            </Container>
         </div>
      </LanguageDetailsProvider>
   );
}
