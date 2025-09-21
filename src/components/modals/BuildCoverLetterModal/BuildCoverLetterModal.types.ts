export type GenerateCoverLetterStatus = 'starting' | 'generating' | 'success' | 'error';

export interface BuildCoverLetterModalProps {
   isOpen: boolean;
   onClose: () => void;
   opportunityId: number;
   companyId?: number;
}

export interface BuildCoverLetterResponse {
   letterSubject: string;
   letterBody: string;
}
