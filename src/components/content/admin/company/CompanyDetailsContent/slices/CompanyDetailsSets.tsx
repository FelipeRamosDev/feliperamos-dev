import { Card, Markdown } from '@/components/common';
import EditCompanySetForm from '@/components/forms/companies/EditCompanySetForm/EditCompanySetForm';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import TabsContent from '@/components/layout/TabsContent/TabsContent';
import { TabOption } from '@/components/layout/TabsContent/TabsContent.types';
import { Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCompanyDetails } from '../CompanyDetailsContext';
import { useState } from 'react';
import { CompanySetData } from '@/types/database.types';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CompanyDetailsContent.text';

export default function CompanyDetailsSets(): React.ReactElement {
   const company = useCompanyDetails();
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);

   const tabOptions: TabOption[] = company.languageSets.map((set: CompanySetData) => ({
      label: set.language_set || textResources.getText('CompanyDetailsContent.label.unknownLanguageSet'),
      value: set.language_set || 'unknown-language-set',
   }));

   return (
      <Card padding="l">
         <WidgetHeader title={textResources.getText('CompanyDetailsContent.header.languageSets')}>
            {!editMode && (
               <IconButton
                  onClick={() => setEditMode(true)}
                  title={textResources.getText('CompanyDetailsContent.button.editLanguageSet')}
                  aria-label={textResources.getText('CompanyDetailsContent.button.editLanguageSet')}
               >
                  <Edit />
               </IconButton>
            )}
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
                     <DataContainer>
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
