import { OpportunityData } from "@/types/database.types";

export interface EditOpportunityFormProps {
   opportunity: OpportunityData;
   updateData: (newData: OpportunityData) => void;
}
