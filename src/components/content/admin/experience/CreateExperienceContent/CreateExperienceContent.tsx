'use client';

import { PageHeader } from '@/components/headers';
import { Container } from '@/components/common';
import { CreateExperienceForm } from '@/components/forms/experiences';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './CreateExperienceContent.text';

export default function CreateExperienceContent() {
   const { textResources } = useTextResources(texts);

   return (
      <div className="CreateExperienceContent">
         <PageHeader
            title={textResources.getText('CreateExperienceContent.pageHeader.title')}
            description={textResources.getText('CreateExperienceContent.pageHeader.description')}
         />

         <Container>
            <CreateExperienceForm />
         </Container>
      </div>
   );
}
