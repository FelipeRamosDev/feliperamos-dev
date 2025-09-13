import { CompanyData } from "@/types/database.types";

export interface OpportunityHeaderProps {
   opportunityId?: number;
   jobTitle?: string;
   company?: CompanyData;
   editMode?: boolean;
   setEditMode?: (value: boolean | ((prev: boolean) => boolean)) => void;
}
