import type { ExperienceItemProps } from './Experience.types';
import { SkillBadge } from '@/components/badges';
import Image from 'next/image';
import { Public } from '@mui/icons-material';
import { RoundButton } from '@/components/buttons';
import { SkillData } from '@/types/database.types';
import { DateView, Markdown } from '@/components/common';

export default function ExperienceItem({ experience }: ExperienceItemProps): React.ReactElement {
   const iconButtonDefault = {
      className: 'icon-button',
      color: 'inherit' as const,
      size: 'medium' as const
   };

   return (
      <div className="ExperienceItem" data-testid="experience-item">
         <div className="experience-header">
            <div className="avatar">
               <Image
                  src={experience?.company?.logo_url || ''}
                  alt={`${experience?.company?.company_name} Logo`}
                  width={120}
                  height={120}
                  loading="lazy"
               />
            </div>

            <div className="header-content">
               <h3 className="company-name">
                  {experience?.company?.company_name}

                  {experience?.company?.site_url && (
                     <RoundButton
                        title={`${experience?.company?.company_name} website`}
                        onClick={() => window.open(experience?.company?.site_url, '_blank')}
                        {...iconButtonDefault}
                     >
                        <Public />
                     </RoundButton>
                  )}
               </h3>
               <p className="position">{experience?.position}</p>

               <span className="period-date">
                  <DateView date={experience?.start_date} /> - <DateView date={experience?.end_date} />
               </span>
            </div>
         </div>

         <div className="skills">
            {experience?.skills?.map((skill: SkillData) => (
               <SkillBadge
                  key={skill.id + experience.company?.company_name}
                  className="skill"
                  value={skill.name}
                  padding="xs"
                  disabled
                  data-testid="skill-badge"
                  data-value={skill.name}
               />
            ))}
         </div>

         <div className="experience-container">
            <Markdown className="description" value={experience?.description} />
            <Markdown className="experience-sidebar" value={experience?.responsibilities} />
         </div>
      </div>
   );
}
