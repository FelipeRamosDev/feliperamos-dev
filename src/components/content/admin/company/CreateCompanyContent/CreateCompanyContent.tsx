'use client';

import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import { CreateCompanyForm } from '@/components/forms';

export default function CreateCompanyContent() {

   return (
      <div className="CreateCompanyContent">
         <PageHeader
            title="Create Company"
            description="Fill in the details below to create a new company."
         />

         <Container>
            <CreateCompanyForm />
         </Container>
      </div>
   );
}
