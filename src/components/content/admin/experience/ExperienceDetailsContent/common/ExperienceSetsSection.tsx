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
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../ExperienceDetailsContent.text';

export default function ExperienceSetsSection(): React.ReactElement {
   const experience = useExperienceDetails();
   const [editMode, setEditMode] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);

   const tabOptions: TabOption[] = experience.languageSets.map((set: ExperienceSetData) => ({
      label: set.language_set || 'Unknown Language Set',
      value: set.language_set || 'unknown-language-set',
   }));

   return (
      <Card padding="l">
         <div className={classNames.cardHeader}>
            <h2>{textResources.getText('ExperienceSetsSection.title')}</h2>

            {!editMode && (
               <IconButton
                  className={classNames.editButton}
                  onClick={() => setEditMode(true)}
                  aria-label={textResources.getText('ExperienceSetsSection.editButton')}>
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
                        <label>{textResources.getText('ExperienceSetsSection.field.position')}</label>
                        <p>{languageSet.position || textResources.getText('ExperienceSetsSection.field.position.noPosition')}</p>
                     </FieldWrap>
                     <FieldWrap>
                        <label>{textResources.getText('ExperienceSetsSection.field.slug')}</label>
                        <p>{languageSet.slug || textResources.getText('ExperienceSetsSection.field.slug.noSlug')}</p>
                     </FieldWrap>

                     <FieldWrap vertical>
                        <label>{textResources.getText('ExperienceSetsSection.field.summary')}</label>
                        <Markdown value={languageSet.summary || textResources.getText('ExperienceSetsSection.field.summary.noSummary')} />
                     </FieldWrap>
                     <FieldWrap vertical>
                        <label>{textResources.getText('ExperienceSetsSection.field.description')}</label>
                        <Markdown value={languageSet.description || textResources.getText('ExperienceSetsSection.field.description.noDescription')} />
                     </FieldWrap>
                     <FieldWrap vertical>
                        <label>{textResources.getText('ExperienceSetsSection.field.responsibilities')}</label>
                        <Markdown value={languageSet.responsibilities || textResources.getText('ExperienceSetsSection.field.responsibilities.noResponsibilities')} />
                     </FieldWrap>
                  </div>
               );
            })}
         </TabsContent>
      </Card>
   );
}
