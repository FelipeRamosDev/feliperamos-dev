import { LanguageData } from '@/types/database.types';

export interface LanguageDetailsContentProps {
   language: LanguageData;
}

export interface LanguageDetailsContextProps {
   language: LanguageData;
   children: React.ReactNode;
}
