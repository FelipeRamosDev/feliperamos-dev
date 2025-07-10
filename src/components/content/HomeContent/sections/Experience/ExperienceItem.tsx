import type { WorkExperienceProps } from './Experience.types';
import { SkillBadge } from '@/components/badges';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import experienceText from './Experience.text';
import Image from 'next/image';
import { Public } from '@mui/icons-material';
import { RoundButton } from '@/components/buttons';

export default function ExperienceItem({ company }: WorkExperienceProps): React.ReactElement {
   const { textResources } = useTextResources(experienceText);
   const scriptRegex = /<script.*?>.*?<\/script>/g;
   const description = company.description?.replace(scriptRegex, '');
   const sidebar = company.sidebar?.replace(scriptRegex, '');
   const startDate = textResources.getText('Experience.work.date', company.startDate);
   const endDate = textResources.getText('Experience.work.date', company.endDate);

   const iconButtonDefault = {
      className: 'icon-button',
      color: 'inherit' as const,
      size: 'medium' as const
   };

   return (
      <div className="ExperienceItem">
         <div className="experience-header">
            <div className="avatar">
               <Image
                  src={company.logoUrl || ''}
                  alt={`${company.company} Logo`}
                  width={120}
                  height={120}
                  loading="lazy"
               />
            </div>

            <div className="header-content">
               <h3 className="company-name">
                  {company.company}

                  {company.companyUrl && (
                     <RoundButton
                        title={`${company.company} website`}
                        onClick={() => window.open(company.companyUrl, '_blank')}
                        {...iconButtonDefault}
                     >
                        <Public />
                     </RoundButton>
                  )}
               </h3>
               <p className="position">{company.position}</p>

               <span className="period-date">
                  {startDate} - {endDate}
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
            <div className="description" dangerouslySetInnerHTML={{ __html: description }}></div>
            <div className="experience-sidebar" dangerouslySetInnerHTML={{ __html: sidebar }}></div>
         </div>
      </div>
   );
}
