import { Card, Markdown } from '@/components/common';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import TabsContent from '@/components/layout/TabsContent/TabsContent';
import { TabOption } from '@/components/layout/TabsContent/TabsContent.types';
import { useState } from 'react';
import { useSkillDetails } from '../SkillDetailsContext';
import { SkillData } from '@/types/database.types';
import EditSkillSetForm from '@/components/forms/skills/EditSkillSetForm/EditSkillSetForm';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../SkillDetailsContent.text';
import { EditButtons } from '@/components/buttons';

export default function SkillDetailsSets(): React.ReactElement {
   const [editMode, setEditMode] = useState<boolean>(false);
   const skill = useSkillDetails();
   const { textResources } = useTextResources(texts);

   const tabOptions: TabOption[] = skill.languageSets.map((set: SkillData) => ({
      label: set.language_set || textResources.getText('SkillDetailsContent.skillSets.unknownSet'),
      value: set.language_set || 'unknown-language-set',
   }));

   return (
      <Card padding="l">
         <WidgetHeader title={textResources.getText('SkillDetailsContent.skillSets.title')}>
            <EditButtons
               editMode={editMode}
               setEditMode={setEditMode}
            />
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
                     <DataContainer vertical>
                        <label>{textResources.getText('SkillDetailsContent.skillSets.journey')}</label>
                        <Markdown value={languageSet.journey || textResources.getText('SkillDetailsContent.skillSets.noJourney')} />
                     </DataContainer>
                  </div>
               );
            })}
         </TabsContent>
      </Card>
   );
}