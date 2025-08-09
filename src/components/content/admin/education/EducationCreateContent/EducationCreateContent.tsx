'use client';

import { PageHeader } from '@/components/headers';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './EducationCreateContent.texts';
import { CreateEducationForm } from '@/components/forms/educations';

export default function EducationCreateContent() {
   const { textResources } = useTextResources(texts);

   return (
      <div className="EducationCreateContent">
         <PageHeader
            title={textResources.getText('EducationCreateContent.pageTitle')}
            description={textResources.getText('EducationCreateContent.pageDescription')}
         />

         <CreateEducationForm />
      </div>
   );
}
