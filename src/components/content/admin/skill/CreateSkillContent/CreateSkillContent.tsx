'use client';

import { Container } from '@/components/common';
import CreateSkillForm from '@/components/forms/skills/CreateSkillForm/CreateSkillForm';
import { PageHeader } from '@/components/headers';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './CreateSkillContent.text';

export default function CreateSkillContent() {
   const { textResources } = useTextResources(texts);

   return (
      <div className="CreateSkillContent">
         <PageHeader
            title={textResources.getText('CreateSkillContent.title')}
            description={textResources.getText('CreateSkillContent.subtitle')}
         />

         <Container>
            <CreateSkillForm />
         </Container>
      </div>
   );
}
