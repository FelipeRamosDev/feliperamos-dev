import { LetterData } from "@/types/database.types";

export type GenerateCoverLetterStatus = 'starting' | 'generating' | 'success' | 'error';

export interface CoverLetterModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: (newData: LetterData) => void;
   opportunityId: number;
   companyId?: number;
}

export interface CoverLetterResponse {
   letterSubject: string;
   letterBody: string;
}
