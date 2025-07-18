import { ExperienceData } from '@/types/database.types';
import { createContext, useContext } from 'react';
import { ExperienceDetailsContextProps } from './ExperienceDetailsContent.types';

export const ExperienceDetailsContext = createContext<ExperienceData | null>(null);

export default function ExperienceDetailsProvider({ experience, children }: ExperienceDetailsContextProps): React.ReactElement {
   return (
      <ExperienceDetailsContext.Provider value={experience}>
         {children}
      </ExperienceDetailsContext.Provider>
   );
}

export function useExperienceDetails() {
   const context = useContext(ExperienceDetailsContext);

   if (context === null) {
      throw new Error('useExperienceDetails must be used within an ExperienceDetailsProvider');
   }

   return context;
}
