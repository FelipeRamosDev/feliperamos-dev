import { CompanyData } from '@/types/database.types';
import { createContext, useContext } from 'react';
import { CompanyDetailsContextProps } from './CompanyDetailsContent.types';

export const CompanyDetailsContext = createContext<CompanyData | null>(null);

export default function CompanyDetailsProvider({ company, children }: CompanyDetailsContextProps): React.ReactElement {
   return (
      <CompanyDetailsContext.Provider value={company}>
         {children}
      </CompanyDetailsContext.Provider>
   );
}

export function useCompanyDetails() {
   const context = useContext(CompanyDetailsContext);

   if (context === null) {
      throw new Error('useCompanyDetails must be used within an CompanyDetailsProvider');
   }

   return context;
}
