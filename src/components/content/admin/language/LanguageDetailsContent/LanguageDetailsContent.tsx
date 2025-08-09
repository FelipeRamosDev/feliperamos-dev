'use client';

import { PageHeader, WidgetHeader } from '@/components/headers';
import { LanguageDetailsContentProps } from './LanguageDetailsContent.types';
import LanguageDetailsProvider from './LanguageDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './LanguageDetailsContent.texts';
import { ContentSidebar, DataContainer } from '@/components/layout';
import { Fragment } from 'react';
import { Card, Container } from '@/components/common';
import { CardProps } from '@/components/common/Card/Card.types';

export default function LanguageDetailsContent({ language }: LanguageDetailsContentProps) {
   const { textResources } = useTextResources(texts);
   const cardProps: CardProps = { padding: 'm' };

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
                     />

                     <Card {...cardProps}>
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
                     </Card>

                     <WidgetHeader
                        title={textResources.getText('LanguageDetails.levelsHeader.title')}
                     />
                     <Card {...cardProps}>
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
                  </Fragment>
               </ContentSidebar>
            </Container>
         </div>
      </LanguageDetailsProvider>
   );
}
