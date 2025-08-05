import type { ExperienceItemProps } from './Experience.types';
import { SkillBadge } from '@/components/badges';
import Image from 'next/image';
import { CalendarMonth, Monitor } from '@mui/icons-material';
import { SkillData } from '@/types/database.types';
import { Card, Markdown } from '@/components/common';
import Link from 'next/link';
import { ContentSidebar } from '@/components/layout';
import { CardProps } from '@/components/common/Card/Card.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './Experience.text'

export default function ExperienceItem({ experience }: ExperienceItemProps): React.ReactElement {
   const { textResources } = useTextResources(texts);
   const cardProps: CardProps = {
      padding: 'l',
      elevation: 'none'
   }

   return (
      <div className="ExperienceItem" data-testid="experience-item">
         <Card className="experience-header" {...cardProps}>
            <div className="horizontal-content">
               <div className="avatar">
                  <Image
                     src={experience?.company?.logo_url || ''}
                     alt={`${experience?.company?.company_name} Logo`}
                     width={250}
                     height={250}
                     loading="lazy"
                  />
               </div>

               <div className="header-content">
                  <h3 className="company-name">
                     {textResources.getText('Experience.item.title', String(experience?.position), String(experience?.company?.company_name))}
                  </h3>

                  <span className="period-date">
                     <CalendarMonth fontSize='small' />
                     {textResources.getText('Experience.item.experienceTime', String(experience?.start_date), String(experience?.end_date))}
                     {' '}
                     {textResources.getText('Experience.item.timeDifference', String(experience?.start_date), String(experience?.end_date))}
                  </span>

                  {experience?.company?.site_url && (
                     <Link className="link-icon" href={experience?.company?.site_url} target="_blank">
                        <Monitor fontSize='small' />
                        {experience?.company?.site_url}
                     </Link>
                  )}
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
         </Card>

         <ContentSidebar className="experience-details">
            <Card className="summary-description" {...cardProps}>
               <Markdown className="summary" value={experience?.summary} />
               <Markdown className="description" value={experience?.description} />
            </Card>

            <Card {...cardProps}>
               <Markdown className="responsibilities" value={experience?.responsibilities} />
            </Card>
         </ContentSidebar>
      </div>
   );
}
