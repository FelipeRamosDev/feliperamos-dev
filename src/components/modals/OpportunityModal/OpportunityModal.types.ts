import { SizeKeyword } from "@/helpers/parse.helpers";
import { OpportunityData } from "@/types/database.types";

export interface OpportunityModalProps {
   isOpen: boolean;
   onClose: () => void;
   data: OpportunityData | null;
}
