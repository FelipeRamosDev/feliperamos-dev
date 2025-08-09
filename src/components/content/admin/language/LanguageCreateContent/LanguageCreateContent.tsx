'use client';

import { CreateLanguageForm } from '@/components/forms/languages';
import { PageHeader } from '@/components/headers';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './LanguageCreateContent.texts';

export default function LanguageCreateContent() {
   const { textResources } = useTextResources(texts);

   return (
      <div className="LanguageCreateContent">
         <PageHeader
            title={textResources.getText('LanguageCreateContent.pageHeader.title')}
            description={textResources.getText('LanguageCreateContent.pageHeader.description')}
         />

         <CreateLanguageForm />
      </div>
   );
}
