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
      <section className="Experience">
         <Container padding="xl">
            <h2 className="section-title">{textResources.getText('Experience.title')}</h2>
            <p className="section-description">{textResources.getText('Experience.description')}</p>

            {experiences.map((experience: ExperienceData) => <ExperienceItem
               key={experience.id}
               experience={experience}
            />)}
         </Container>
      </section>
   );
}
