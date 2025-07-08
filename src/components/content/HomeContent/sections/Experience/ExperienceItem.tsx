import type { WorkExperienceProps } from './Experience.types';
import { SkillBadge } from '@/components/badges';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import experienceText from './Experience.text';
import { Avatar } from '@mui/material';
import { Public } from '@mui/icons-material';
import { RoundButton } from '@/components/buttons';

export default function ExperienceItem({ company }: WorkExperienceProps): React.ReactElement {
   const { textResources } = useTextResources(experienceText);

   const iconButtonDefault = {
      className: 'icon-button',
      color: 'inherit' as const,
      size: 'medium' as const
   };

   return (
      <div className="ExperienceItem">
         <div className="experience-header">
            <Avatar
               src={company.logoUrl || ''}
               alt={`${company.company} Logo`}
            />

            <div className="header-content">
               <h3 className="company-name">
                  {company.company}

                  {company.companyUrl && (
                     <RoundButton
                        onClick={() => window.open(company.companyUrl, '_blank')}
                        {...iconButtonDefault}
                     >
                        <Public />
                     </RoundButton>
                  )}
               </h3>
               <p className="position">{company.position}</p>

               <span className="period-date">
                  {textResources.getText('Experience.work.date', company.startDate)} - {textResources.getText('Experience.work.date', company.endDate)}
               </span>
            </div>
         </div>

         <div className="skills">
            {company.skills?.map((skill) => (
               <SkillBadge
                  key={skill}
                  className="skill"
                  value={skill}
                  padding="xs"
                  disabled
               />
            ))}
         </div>

         <div className="experience-container">
            <div className="description" dangerouslySetInnerHTML={{ __html: company.description || '' }}></div>
            <div className="experience-sidebar"dangerouslySetInnerHTML={{ __html: company.sidebar || '' }}></div>
         </div>
      </div>
   );
}
