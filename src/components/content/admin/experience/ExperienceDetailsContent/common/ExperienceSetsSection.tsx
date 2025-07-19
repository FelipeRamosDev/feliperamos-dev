import { Card, Markdown } from '@/components/common';
import TabsContent from '@/components/layout/TabsContent/TabsContent';
import { TabOption } from '@/components/layout/TabsContent/TabsContent.types';
import { useExperienceDetails } from '../ExperienceDetailsContext';
import styleModule from '../ExperienceDetailsContent.module.scss';
import FieldWrap from './ExperienceDetailsFieldWrap';
import classNames from '../ExperienceDetailsContent.module.scss';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import EditExperienceSetForm from '@/components/forms/EditExperienceSetForm/EditExperienceSetForm';
import CreateExperienceSetForm from '@/components/forms/CreateExperienceSetForm/CreateExperienceSetForm';
import { ExperienceSetData } from '@/types/database.types';

export default function ExperienceSetsSection(): React.ReactElement {
   const experience = useExperienceDetails();
   const [editMode, setEditMode] = useState<boolean>(false);

   const tabOptions: TabOption[] = experience.languageSets.map((set: ExperienceSetData) => ({
      label: set.language_set || 'Unknown Language Set',
      value: set.language_set || 'unknown-language-set',
   }));

   return (
      <Card padding="l">
         <div className={classNames.cardHeader}>
            <h2>Language Sets</h2>

            {!editMode && (
               <IconButton className={classNames.editButton} onClick={() => setEditMode(true)} aria-label="Edit Experience">
                  <Edit />
               </IconButton>
            )}
         </div>

         <TabsContent
            options={tabOptions}
            className={styleModule.tabs}
            useNewButton
            newContent={<CreateExperienceSetForm experienceId={experience.id} />}
         >
            {tabOptions.map((option: TabOption) => {
               const languageSet = experience.languageSets.find(set => set.language_set === option.value);

               if (!languageSet) {
                  return null;
               }

               if (editMode) {
                  return (
                     <EditExperienceSetForm key={option.value} language_set={option.value} />
                  );
               }

               return (
                  <div className={styleModule.languageSet} key={option.value}>
                     <FieldWrap>
                        <label>Position:</label>
                        <p>{languageSet.position || 'No position available.'}</p>
                     </FieldWrap>
                     <FieldWrap>
                        <label>Slug:</label>
                        <p>{languageSet.slug || 'No slug available.'}</p>
                     </FieldWrap>

                     <FieldWrap vertical>
                        <label>Summary:</label>
                        <Markdown value={languageSet.summary || 'No summary available.'} />
                     </FieldWrap>
                     <FieldWrap vertical>
                        <label>Description:</label>
                        <Markdown value={languageSet.description || 'No description available.'} />
                     </FieldWrap>
                     <FieldWrap vertical>
                        <label>Responsibilities:</label>
                        <Markdown value={languageSet.responsibilities || 'No responsibilities available.'} />
                     </FieldWrap>
                  </div>
               );
            })}
         </TabsContent>
      </Card>
   );
}
