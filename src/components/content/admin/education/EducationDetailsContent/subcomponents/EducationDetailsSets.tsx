import { Card, Markdown } from '@/components/common';
import { EducationDetailsSubcomponentProps } from '../EducationDetailsContent.types';
import { WidgetHeader } from '@/components/headers';
import { DataContainer, TabsContent } from '@/components/layout';
import { TabOption } from '@/components/layout/TabsContent/TabsContent.types';
import { useEducationDetails } from '../EducationDetailsContext';
import { EducationSetData } from '@/types/database.types';
import { useState } from 'react';
import { languageNames } from '@/app.config';
import { EditButtons } from '@/components/buttons';
import { EditEducationSetForm } from '@/components/forms/educations';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../EducationDetailsContent.texts';

export default function EducationDetailsSets({ cardProps }: EducationDetailsSubcomponentProps): React.ReactElement {
   const [editMode, setEditMode] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);
   const education = useEducationDetails();
   const EMPTY_FALLBACK = '---';

   const tabOptions: TabOption[] = education.languageSets?.map((set: EducationSetData) => ({
      label: languageNames[set.language_set] || textResources.getText('EducationDetailsSet.noSets'),
      value: set.language_set || 'unknown-language-set',
   })) || [];

   return (
      <Card className="EducationDetailsSets" {...cardProps}>
         <WidgetHeader title={textResources.getText('EducationDetailsSet.widgetTitle')}>
            <EditButtons
               editMode={editMode}
               setEditMode={setEditMode}
            />
         </WidgetHeader>

         <TabsContent
            options={tabOptions}
         >
            {tabOptions.map((option: TabOption) => {
               const languageSet = education.languageSets?.find(set => set.language_set === option.value);

               if (!languageSet) {
                  return null;
               }

               if (editMode) {
                  return (
                     <EditEducationSetForm key={option.value} language_set={option.value} />
                  );
               }

               return (
                  <div key={option.value}>
                     <DataContainer>
                        <label>{textResources.getText('EducationDetailsSet.fields.field_of_study.label')}</label>
                        <p>{languageSet.field_of_study || EMPTY_FALLBACK}</p>
                     </DataContainer>
                     <DataContainer>
                        <label>{textResources.getText('EducationDetailsSet.fields.degree.label')}</label>
                        <p>{languageSet.degree || EMPTY_FALLBACK}</p>
                     </DataContainer>
                     <DataContainer>
                        <label>{textResources.getText('EducationDetailsSet.fields.grade.label')}</label>
                        <p>{languageSet.grade || EMPTY_FALLBACK}</p>
                     </DataContainer>
                     <DataContainer vertical>
                        <label>{textResources.getText('EducationDetailsSet.fields.description.label')}</label>
                        <Markdown value={languageSet.description || EMPTY_FALLBACK} />
                     </DataContainer>
                  </div>
               );
            })}
         </TabsContent>
      </Card>
   );
}
