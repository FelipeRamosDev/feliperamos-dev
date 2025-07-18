import Card from '@/components/common/Card/Card';
import { Fragment }  from 'react';
import FieldWrap from './ExperienceDetailsFieldWrap';
import { SkillBadge } from '@/components/badges';
import { useExperienceDetails } from '../ExperienceDetailsContext';

function SectionCard({ children }: { children: React.ReactNode }) {
   return <Card padding="l">{children}</Card>;
}

export default function ExperienceDetailsSidebar(): React.ReactElement {
   const experience = useExperienceDetails();

   return (
      <Fragment>
         <SectionCard>
            <FieldWrap>
               <label>ID:</label>
               <p>{experience.id}</p>
            </FieldWrap>
            <FieldWrap>
               <label>Status:</label>
               <p>{experience.status}</p>
            </FieldWrap>
         </SectionCard>

         <SectionCard>
            <h2>Skills</h2>

            <FieldWrap>
               {experience.skills.length > 0 ? (
                  experience.skills.map((skill) => (
                     <SkillBadge key={skill.skill_id} value={skill.name} />
                  ))
               ) : (
                  <p>No skills associated with this experience.</p>
               )}
            </FieldWrap>
         </SectionCard>
      </Fragment>
   );
}
