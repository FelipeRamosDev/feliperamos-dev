import { LetterData } from "@/types/database.types";

export interface BuildCoverLetterFormProps {
   initialValues?: Partial<LetterData>
   opportunityId?: number;
   companyId?: number;
   onSuccess?: (newData: LetterData) => void;
}
