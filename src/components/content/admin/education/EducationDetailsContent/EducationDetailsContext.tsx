'use client';

import { EducationData } from '@/types/database.types';
import { createContext, useContext } from 'react';
import { EducationDetailsContextProps } from './EducationDetailsContent.types';

export const EducationDetailsContext = createContext<EducationData | null>(null);

export default function EducationDetailsProvider({ education, children }: EducationDetailsContextProps): React.ReactElement {
   return (
      <EducationDetailsContext.Provider value={education}>
         {children}
      </EducationDetailsContext.Provider>
   );
}

export function useEducationDetails() {
   const context = useContext(EducationDetailsContext);

   if (context === null) {
      throw new Error('useEducationDetails must be used within an EducationDetailsProvider');
   }

   return context;
}
