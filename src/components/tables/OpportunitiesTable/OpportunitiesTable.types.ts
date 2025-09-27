import { OpportunityData } from "@/types/database.types";

export interface OpportunitiesTableProps {
   where?: Record<string, unknown>;
   sort?: keyof OpportunityData;
   order?: 'ASC' | 'DESC';
}
