import Card from '@/components/common/Card/Card';
import { Fragment, useState } from 'react';
import FieldWrap from './ExperienceDetailsFieldWrap';
import { SkillBadge } from '@/components/badges';
import { useExperienceDetails } from '../ExperienceDetailsContext';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import classNames from '../ExperienceDetailsContent.module.scss'
import EditExperienceStatus from '@/components/forms/experiences/EditExperienceStatus/EditExperienceStatus';
import EditExperienceSkills from '@/components/forms/experiences/EditExperienceSkills/EditExperienceSkills';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../ExperienceDetailsContent.text';

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
            <FieldWrap>
               <label>{textResources.getText('ExperienceDetailsSidebar.sectionCard.id')}</label>
               <p>{experience.id}</p>
            </FieldWrap>

            <EditExperienceStatus />
         </SectionCard>

         <SectionCard>
            <div className={classNames.cardHeader}>
               <h2>{textResources.getText('ExperienceDetailsSidebar.sectionCard.skills.title')}</h2>

               {!editSkills && (
                  <IconButton className={classNames.editButton} onClick={() => setEditSkills(true)} aria-label={textResources.getText('ExperienceDetailsSidebar.sectionCard.skills.editButton')}>
                     <Edit />
                  </IconButton>
               )}
            </div>

            {editSkills && <EditExperienceSkills />}
            {!editSkills && (
               <FieldWrap>
                  {experience.skills.length > 0 ? (
                     experience.skills.map((skill) => (
                        <SkillBadge key={skill.skill_id} value={skill.name} />
                     ))
                  ) : (
                     <p>{textResources.getText('ExperienceDetailsSidebar.sectionCard.skills.noSkills')}</p>
                  )}
               </FieldWrap>
            )}
         </SectionCard>
      </Fragment>
   );
}
