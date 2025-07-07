'use client';

import { Container } from '@/components/common';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import experienceText from './Experience.text';
import WorkExperience from './WorkExperience';
import companies from './companies';

export default function Experience() {
   const { textResources } = useTextResources(experienceText);
   const companiesList = companies(textResources);

   return (
      <section className="Experience">
         <Container padding="xl">
            <h2 className="section-title">{textResources.getText('Experience.title')}</h2>
            {/* <p className="section-description">{textResources.getText('Experience.description')}</p> */}

            {companiesList.map((company, index) => <WorkExperience
               key={index}
               company={company}
            />)}
         </Container>
      </section>
   );
}
