import { CVData } from '@/types/database.types';
import { createContext, useContext } from 'react';
import { CVDetailsContextProps } from './CVDetailsContent.types';

export const CVDetailsContext = createContext<CVData | null>(null);

export default function CVDetailsProvider({ cv, children }: CVDetailsContextProps): React.ReactElement {
   return (
      <CVDetailsContext.Provider value={cv}>
         {children}
      </CVDetailsContext.Provider>
   );
}

export function useCVDetails() {
   const context = useContext(CVDetailsContext);

   if (context === null) {
      throw new Error('useCVDetails must be used within an CVDetailsProvider');
   }

   return context;
}
