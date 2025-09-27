import { OpportunityData } from "@/types/database.types";

export interface EditOpportunityFormProps {
   opportunity: OpportunityData;
   updateData: (id: number, data: Partial<OpportunityData>) => Promise<OpportunityData>;
}
