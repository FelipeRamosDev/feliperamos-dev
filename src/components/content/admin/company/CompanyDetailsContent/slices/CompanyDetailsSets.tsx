import { Card, Markdown } from '@/components/common';
import { EditCompanySetForm } from '@/components/forms/companies';
import { WidgetHeader } from '@/components/headers';
import { TabOption } from '@/components/layout/TabsContent/TabsContent.types';
import { useCompanyDetails } from '../CompanyDetailsContext';
import { useState } from 'react';
import { CompanySetData } from '@/types/database.types';
import { DataContainer, TabsContent } from '@/components/layout';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CompanyDetailsContent.text';
import { EditButtons } from '@/components/buttons';

export default function CompanyDetailsSets(): React.ReactElement {
   const company = useCompanyDetails();
   const [editMode, setEditMode] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);

   const tabOptions: TabOption[] = company.languageSets.map((set: CompanySetData) => ({
      label: set.language_set || textResources.getText('CompanyDetailsContent.label.unknownLanguageSet'),
      value: set.language_set || 'unknown-language-set',
   }));

   return (
      <Card padding="l">
         <WidgetHeader title={textResources.getText('CompanyDetailsContent.header.languageSets')}>
            <EditButtons
               editMode={editMode}
               setEditMode={setEditMode}
            />
         </WidgetHeader>

         <TabsContent
            options={tabOptions}
            useNewButton
            newContent={<EditCompanySetForm />}
         >
            {tabOptions.map((option: TabOption) => {
               const languageSet = company.languageSets.find(set => set.language_set === option.value);

               if (!languageSet) {
                  return null;
               }

               if (editMode) {
                  return (
                     <EditCompanySetForm key={option.value} language_set={option.value} editMode />
                  );
               }

               return (
                  <div className="company-content" key={option.value}>
                     <DataContainer>
                        <label>{textResources.getText('CompanyDetailsContent.label.industry')}</label>
                        <p>{languageSet.industry || textResources.getText('CompanyDetailsContent.feedback.noIndustry')}</p>
                     </DataContainer>
                     <DataContainer vertical>
                        <label>{textResources.getText('CompanyDetailsContent.label.description')}</label>
                        <Markdown value={languageSet.description || textResources.getText('CompanyDetailsContent.feedback.noDescription')} />
                     </DataContainer>
                  </div>
               );
            })}
         </TabsContent>
      </Card>
   );
}
