import { AjaxResponse } from '@/services';
import { LetterData } from '@/types/database.types';

export interface LetterModalProps {
   letter: LetterData | null;
   onClose: () => void;
   updateLetter: (id: number, data: Partial<LetterData>) => Promise<LetterData | Error>;
   deleteLetter: (id: number) => Promise<AjaxResponse<LetterData>>;
}
