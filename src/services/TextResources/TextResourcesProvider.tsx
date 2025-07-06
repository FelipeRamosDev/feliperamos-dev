import { createContext, useContext } from 'react';
import type { TextResourcesContextValue, TextResourcesProviderProps } from './TextResources.types';
import TextResources from './TextResources';

const TextResourcesContext = createContext<TextResourcesContextValue | null>(null);

export function TextResourcesProvider({
   language,
   allowedLanguages,
   defaultLanguage,
   children
}: TextResourcesProviderProps) {
   const textResources = new TextResources(allowedLanguages, defaultLanguage);

   TextResources.allowedLanguages = allowedLanguages;
   TextResources.defaultLanguage = defaultLanguage;

   if (language) {
      textResources.setLanguage(language);
   }

   return (
      <TextResourcesContext.Provider value={{ textResources }}>
         {children}
      </TextResourcesContext.Provider>
   );
}

export function useTextResources(initResources?: TextResources): TextResourcesContextValue {
   const context = useContext(TextResourcesContext);
   
   if (!context) {
      throw new Error('useTextResources must be used within a TextResourcesProvider');
   }

   if (initResources) {
      context.textResources.merge(initResources);
   }

   return context;
}
