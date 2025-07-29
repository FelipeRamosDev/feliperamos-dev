'use client';

import { Container } from '@/components/common';
import { CreateCurriculumForm } from '@/components/forms/curriculums';
import { PageHeader } from '@/components/headers';
import texts from './CreateCurriculumContent.text';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

export default function CreateCurriculumContent() {
   const { textResources } = useTextResources(texts);

   return (
      <div className="CreateCurriculumContent">
         <PageHeader
            title={textResources.getText('CreateCurriculumForm.pageTitle')}
            description={textResources.getText('CreateCurriculumForm.pageDescription')}
         />

         <Container>
            <CreateCurriculumForm />
         </Container>
      </div>
   );
}
