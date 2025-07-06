import TextResources from '@/services/TextResources/TextResources';
import React, { createContext, useContext, ReactNode } from 'react';

interface PageContextProps {
   textResources: TextResources;
   pageTitle: string;
   language?: string;
}

interface PageProviderProps {
   pageTitle: string;
   language?: string;
   children: ReactNode;
}

export const textResources = new TextResources([ 'en-US', 'pt-BR' ]);
const PageContext = createContext<PageContextProps | undefined>(undefined);

export function PageProvider({ pageTitle, language, children }: PageProviderProps) {
   textResources.setLanguage(language);

   return (
      <PageContext.Provider value={{
         pageTitle,
         language,
         textResources
      }}>
         {children}
      </PageContext.Provider>
   );
};

export const usePageContext = () => {
   const context = useContext(PageContext);

   if (!context) {
      throw new Error('usePageContext must be used within a PageProvider');
   }

   return context;
};
