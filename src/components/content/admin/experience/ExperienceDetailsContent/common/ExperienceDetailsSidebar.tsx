import Card from '@/components/common/Card/Card';
import { Fragment, useState } from 'react';
import { SkillBadge } from '@/components/badges';
import { useExperienceDetails } from '../ExperienceDetailsContext';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import classNames from '../ExperienceDetailsContent.module.scss'
import EditExperienceStatus from '@/components/forms/experiences/EditExperienceStatus/EditExperienceStatus';
import EditExperienceSkills from '@/components/forms/experiences/EditExperienceSkills/EditExperienceSkills';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../ExperienceDetailsContent.text';
import DataContainer from '@/components/layout/DataContainer/DataContainer';

function SectionCard({ children }: { children: React.ReactNode }) {
   return <Card padding="l">{children}</Card>;
}

export default function ExperienceDetailsSidebar(): React.ReactElement {
   const [editSkills, setEditSkills] = useState<boolean>(false);
   const experience = useExperienceDetails();
   const { textResources } = useTextResources(texts);

   return (
      <Fragment>
         <SectionCard>
            <DataContainer>
               <label>{textResources.getText('ExperienceDetailsSidebar.sectionCard.id')}</label>
               <p>{experience.id}</p>
            </DataContainer>

            <EditExperienceStatus />
         </SectionCard>

         <SectionCard>
            <div className={classNames.cardHeader}>
               <h2>{textResources.getText('ExperienceDetailsSidebar.sectionCard.skills.title')}</h2>

               {!editSkills && (
                  <IconButton
                     className={classNames.editButton}
                     onClick={() => setEditSkills(true)}
                     aria-label={textResources.getText('ExperienceDetailsSidebar.sectionCard.skills.editButton')}
                  >
                     <Edit />
                  </IconButton>
               )} 
            </div>

            {editSkills && <EditExperienceSkills />}
            {!editSkills && (
               <DataContainer>
                  {experience.skills.length > 0 ? (
                     experience.skills.map((skill, index) => (
                        <SkillBadge
                           key={String(skill.skill_id) + index + 'sidebar'}
                           value={skill.name}
                        />
                     ))
                  ) : (
                     <p>{textResources.getText('ExperienceDetailsSidebar.sectionCard.skills.noSkills')}</p>
                  )}
               </DataContainer>
            )}
         </SectionCard>
      </Fragment>
   );
}
