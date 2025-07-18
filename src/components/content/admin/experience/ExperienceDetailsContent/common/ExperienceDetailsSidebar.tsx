import Card from '@/components/common/Card/Card';
import { Fragment, useState } from 'react';
import FieldWrap from './ExperienceDetailsFieldWrap';
import { SkillBadge } from '@/components/badges';
import { useExperienceDetails } from '../ExperienceDetailsContext';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import classNames from '../ExperienceDetailsContent.module.scss'
import EditExperienceStatus from '@/components/forms/EditExperienceStatus/EditExperienceStatus';
import EditExperienceSkills from '@/components/forms/EditExperienceSkills/EditExperienceSkills';

function SectionCard({ children }: { children: React.ReactNode }) {
   return <Card padding="l">{children}</Card>;
}

export default function ExperienceDetailsSidebar(): React.ReactElement {
   const [editStatus, setEditStatus] = useState<boolean>(false);
   const [editSkills, setEditSkills] = useState<boolean>(false);
   const experience = useExperienceDetails();

   return (
      <Fragment>
         <SectionCard>
            <FieldWrap>
               <label>ID:</label>
               <p>{experience.id}</p>
            </FieldWrap>

            <EditExperienceStatus />
         </SectionCard>

         <SectionCard>
            <div className={classNames.cardHeader}>
               <h2>Skills</h2>

               {!editSkills && (
                  <IconButton className={classNames.editButton} onClick={() => setEditSkills(true)} aria-label="Edit Skills">
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
                     <p>No skills associated with this experience.</p>
                  )}
               </FieldWrap>
            )}
         </SectionCard>
      </Fragment>
   );
}
