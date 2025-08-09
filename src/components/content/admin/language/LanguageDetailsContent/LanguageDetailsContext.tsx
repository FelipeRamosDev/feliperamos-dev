import { LanguageData } from '@/types/database.types';
import { createContext, useContext } from 'react';
import { LanguageDetailsContextProps } from './LanguageDetailsContent.types';

export const LanguageDetailsContext = createContext<LanguageData | null>(null);

export default function LanguageDetailsProvider({ language, children }: LanguageDetailsContextProps): React.ReactElement {
   return (
      <LanguageDetailsContext.Provider value={language}>
         {children}
      </LanguageDetailsContext.Provider>
   );
}

export function useLanguageDetails() {
   const context = useContext(LanguageDetailsContext);

   if (context === null) {
      throw new Error('useLanguageDetails must be used within an LanguageDetailsProvider');
   }

   return context;
}
