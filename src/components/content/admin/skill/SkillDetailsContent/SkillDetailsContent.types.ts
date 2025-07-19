import { SkillData } from '@/types/database.types';

export interface SkillDetailsContentProps {
   skill: SkillData;
}

export interface SkillDetailsContextProps {
   skill: SkillData;
   children: React.ReactNode;
}
