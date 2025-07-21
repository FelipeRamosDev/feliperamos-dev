'use client';

import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import { CreateCompanyForm } from '@/components/forms';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './CreateCompanyContent.text';

export default function CreateCompanyContent() {
   const { textResources } = useTextResources(texts);

   return (
      <div className="CreateCompanyContent">
         <PageHeader
            title={textResources.getText('CreateCompanyContent.pageHeader.title')}
            description={textResources.getText('CreateCompanyContent.pageHeader.description')}
         />

         <Container>
            <CreateCompanyForm />
         </Container>
      </div>
   );
}
