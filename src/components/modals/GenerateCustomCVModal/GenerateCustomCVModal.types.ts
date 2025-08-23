import { GenerateSummaryParams } from '@/components/widgets/CustomCVWidget/CustomCVWidget.types';

export type LoadStatusOptions = 'started' | 'connecting' | 'fetching-url' | 'generating-summary' | 'success' | 'error';

export interface GenerateCustomCVModalProps {
   className?: string | string[];
   genSummaryParams: GenerateSummaryParams | null;
   isOpen: boolean;
   onClose: () => void;
}

export interface GenerateSummarySuccess {
   summary: string;
   jobDescription: string;
   aiThread: string;
}

export interface GenerateSummaryError {
   error: {
      code: string;
      message: string;
   }
}
