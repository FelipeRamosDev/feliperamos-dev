import { ContentSidebar } from '@/components/layout';
import type { WorkExperienceProps } from './Experience.types';
import { SkillBadge } from '@/components/badges';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import experienceText from './Experience.text';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, IconButton } from '@mui/material';
import { Public } from '@mui/icons-material';

export default function WorkExperience({ company }: WorkExperienceProps): React.ReactElement {
   const { textResources } = useTextResources(experienceText);
   
   const linkDefault = {
      rel: 'noopener noreferrer',
      target: '_blank'
   };

   const iconButtonDefault = {
      className: 'icon-button',
      color: 'inherit' as const,
      size: 'medium' as const
   };

   return (
      <ContentSidebar className="WorkExperience">
         <div className="work-info">
            <div className="company-link">
               <Avatar
                  src={company.logoUrl || ''}
                  alt={`${company.company} Logo`}
               />

               <div className="work-header">
                  <div className="top-title">
                     <h3 className="company-name">
                        {company.company} <span className="position">({company.position})</span>
                     </h3>

                     <IconButton onClick={() => window.open(company.companyUrl, '_blank')} {...iconButtonDefault}>
                        <Public />
                     </IconButton>
                  </div>

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

            <div className="description" dangerouslySetInnerHTML={{ __html: company.description || '' }}></div>
         </div>

         <div className="company-logo">
            {company.thumbUrl && <Image
               src={company.thumbUrl || ''}
               alt={`${company.company} logo`}
            />}
         </div>
      </ContentSidebar>
   );
}
