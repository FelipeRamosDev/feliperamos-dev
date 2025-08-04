'use client';

import { Container } from '@/components/common';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import experienceText from './Experience.text';
import ExperienceItem from './ExperienceItem';
import { ExperienceProps } from './Experience.types';
import { ExperienceData } from '@/types/database.types';

export default function Experience({ experiences = [] }: ExperienceProps) {
   const { textResources } = useTextResources(experienceText);

   return (
      <section className="Experience" data-testid="experience-section">
         <div className="section-header">
            <h2 className="section-title">{textResources.getText('Experience.title')}</h2>
            <p className="section-description">{textResources.getText('Experience.description')}</p>
         </div>

         <Container padding="xl">
            {experiences.map((experience: ExperienceData, idx: number) => (
               <ExperienceItem
                  key={experience.id || idx}
                  experience={experience}
               />
            ))}
         </Container>
      </section>
   );
}
