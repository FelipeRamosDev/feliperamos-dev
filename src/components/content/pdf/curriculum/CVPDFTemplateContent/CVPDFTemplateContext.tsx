import { CVData } from '@/types/database.types';
import { createContext, useContext } from 'react';
import { CVPDFTemplateContextProps } from './CVPDFTemplateContent.types';

export const CVPDFTemplateContext = createContext<CVData | null>(null);

export default function CVPDFTemplateProvider({ cv, children }: CVPDFTemplateContextProps): React.ReactElement {
   return (
      <CVPDFTemplateContext.Provider value={cv}>
         {children}
      </CVPDFTemplateContext.Provider>
   );
}

export function useCVPDFTemplate() {
   const context = useContext(CVPDFTemplateContext);

   if (context === null) {
      throw new Error('useCVPDFTemplate must be used within an CVPDFTemplateProvider');
   }

   return context;
}
