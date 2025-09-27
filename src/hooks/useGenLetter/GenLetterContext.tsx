import { createContext, useContext } from 'react';
import { GenerateLetterContext } from './useGenLetter.types';
import useGenLetter from './useGenLetter';

const genLetterContext = createContext<GenerateLetterContext | null>(null);

export default function GenLetterProvider({ children }: { children: React.ReactNode }) {
   const genLetter = useGenLetter();

   return (
      <genLetterContext.Provider value={genLetter}>
         {children}
      </genLetterContext.Provider>
   );
}

export function useGenLetterContext() {
   const context = useContext(genLetterContext);

   if (!context) {
      throw new Error('useGenLetterContext must be used within a GenLetterProvider');
   }

   return context;
}
