import { Card, Markdown } from '@/components/common';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import { TabOption } from '@/components/layout/TabsContent/TabsContent.types';
import { useCVDetails } from '../CVDetailsContext';
import { CVSetData } from '@/types/database.types';
import TabsContent from '@/components/layout/TabsContent/TabsContent';
import { useState } from 'react';
import { languageNames } from '@/app.config';
import { RoundButton } from '@/components/buttons';
import { Edit } from '@mui/icons-material';
import EditCVSetForm from '@/components/forms/curriculums/EditCVSetForm/EditCVSetForm';

export default function CVDetailsSet({ cardProps }: CVDetailsSubcomponentProps): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const cv = useCVDetails();

   const tabOptions: TabOption[] = cv.languageSets.map((set: CVSetData) => ({
      label: languageNames[set.language_set] || 'Unknown Language Set',
      value: set.language_set || 'unknown-language-set',
   }));

   return (
      <Card className="CVDetailsSets" {...cardProps}>
         <WidgetHeader title="Language Sets">
            {!editMode && <RoundButton title="Edit Curriculum Language Sets" onClick={() => setEditMode(true)}>
               <Edit />
            </RoundButton>}
         </WidgetHeader>

         <TabsContent
            options={tabOptions}
            useNewButton
            newContent={<EditCVSetForm editMode={false} />}
         >
            {tabOptions.map((option: TabOption) => {
               const languageSet = cv.languageSets.find(set => set.language_set === option.value);

               if (!languageSet) {
                  return null;
               }

               if (editMode) {
                  return (
                     <EditCVSetForm key={option.value} language_set={option.value} editMode />
                  );
               }

               return (
                  <div key={option.value}>
                     <DataContainer>
                        <label>Job Title:</label>
                        <p>{languageSet.job_title}</p>
                     </DataContainer>
                     <DataContainer vertical>
                        <label>Summary:</label>
                        <Markdown value={languageSet.summary} />
                     </DataContainer>
                  </div>
               );
            })}
         </TabsContent>
      </Card>
   );
}
