import { LetterData } from "@/types/database.types";

export interface EditLetterFormProps {
   letter: Partial<LetterData>;
   updateLetter: (id: number, data: Partial<LetterData>) => Promise<LetterData | Error>;
}
