'use client';

import { CreateLanguageForm } from '@/components/forms/languages';
import { PageHeader } from '@/components/headers';

export default function LanguageCreateContent() {
   return (
      <div className="LanguageCreateContent">
         <PageHeader title="Create Language" description="Create a new language entry." />

         <CreateLanguageForm />
      </div>
   );
}
