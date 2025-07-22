'use client';

import { Container } from '@/components/common';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import experienceText from './Experience.text';
import ExperienceItem from './ExperienceItem';
import { ExperienceProps } from './Experience.types';
import { ExperienceData } from '@/types/database.types';
import companies from './companies';

export default function Experience({ experiences = [] }: ExperienceProps) {
   const { textResources } = useTextResources(experienceText);

   let experienceList = experiences;
   if (!experienceList || experienceList.length === 0) {
      experienceList = (companies(textResources) || []).map((company, idx) => ({
         id: idx + 1,
         created_at: new Date(),
         updated_at: new Date(),
         schemaName: 'mock',
         tableName: 'mock',
         company: {
            id: idx + 1,
            created_at: new Date(),
            schemaName: 'mock',
            tableName: 'mock',
            company_name: company.company,
            location: '', // fixed: always string
            logo_url: company.logoUrl || '',
            site_url: company.companyUrl || '',
            languageSets: [],
            company_id: idx + 1,
            description: '',
            industry: '',
            language_set: '',
         },
         company_id: idx + 1,
         end_date: new Date(company.endDate),
         languageSets: [],
         skills: (company.skills || []).map((name, skillIdx) => ({
            name,
            category: '',
            level: '',
            journey: '',
            language_set: '',
            skill_id: `${skillIdx}`,
            user_id: '',
            languageSets: [],
            id: skillIdx + 1,
            created_at: new Date(),
            schemaName: 'mock',
            tableName: 'mock',
         })),
         start_date: new Date(company.startDate),
         status: 'published',
         title: company.position,
         type: 'other',
         description: company.description,
         position: company.position,
         responsibilities: company.sidebar,
         slug: '',
         summary: '',
      }));
   }

   return (
      <section className="Experience">
         <Container padding="xl">
            <h2 className="section-title">{textResources.getText('Experience.title')}</h2>
            <p className="section-description">{textResources.getText('Experience.description')}</p>

            {experienceList.map((experience: ExperienceData, idx: number) => (
               <ExperienceItem
                  key={experience.id || idx}
                  experience={experience}
               />
            ))}
         </Container>
      </section>
   );
}
