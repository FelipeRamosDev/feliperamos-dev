import { SkillData } from '@/types/database.types';
import { createContext, useContext } from 'react';
import { SkillDetailsContextProps } from './SkillDetailsContent.types';

export const SkillDetailsContext = createContext<SkillData | null>(null);

export default function SkillDetailsProvider({ skill, children }: SkillDetailsContextProps): React.ReactElement {
   return (
      <SkillDetailsContext.Provider value={skill}>
         {children}
      </SkillDetailsContext.Provider>
   );
}

export function useSkillDetails() {
   const context = useContext(SkillDetailsContext);

   if (context === null) {
      throw new Error('useSkillDetails must be used within an SkillDetailsProvider');
   }

   return context;
}
