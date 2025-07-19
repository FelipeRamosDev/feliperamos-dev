import { Card } from '@/components/common';
import EditCompanySetForm from '@/components/forms/EditCompanySetForm/EditCompanySetForm';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import TabsContent from '@/components/layout/TabsContent/TabsContent';
import { TabOption } from '@/components/layout/TabsContent/TabsContent.types';
import { Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { useSkillDetails } from '../SkillDetailsContext';
import { SkillData } from '@/types/database.types';
import EditSkillSetForm from '@/components/forms/EditSkillSetForm/EditSkillSetForm';
import { allowedLanguages, languageNames } from '@/app.config';

export default function SkillDetailsSets(): React.ReactElement {
   const [editMode, setEditMode] = useState<boolean>(false);
   const skill = useSkillDetails();

   const tabOptions: TabOption[] = skill.languageSets.map((set: SkillData) => ({
      label: set.language_set || 'Unknown Language Set',
      value: set.language_set || 'unknown-language-set',
   }));

   return (
      <Card padding="l">
         <WidgetHeader title="Language Sets">
            {!editMode && (
               <IconButton onClick={() => setEditMode(true)} aria-label="Edit Company">
                  <Edit />
               </IconButton>
            )}
         </WidgetHeader>

         <TabsContent
            options={tabOptions}
            useNewButton
            newContent={<EditSkillSetForm />}
         >
            {tabOptions.map((option: TabOption) => {
               const languageSet = skill.languageSets.find(set => set.language_set === option.value);

               if (!languageSet) {
                  return null;
               }

               if (editMode) {
                  return (
                     <EditSkillSetForm key={option.value} language_set={option.value} editMode />
                  );
               }

               return (
                  <div className="skill-content" key={option.value}>
                     <DataContainer>
                        <label>Journey:</label>
                        <p>{languageSet.journey || 'No journey available.'}</p>
                     </DataContainer>
                  </div>
               );
            })}
         </TabsContent>
      </Card>
   );
}