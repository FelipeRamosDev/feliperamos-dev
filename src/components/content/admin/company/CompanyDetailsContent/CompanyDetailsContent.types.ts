import { CompanyData } from "@/types/database.types";

export interface CompanyDetailsContentProps {
   company: CompanyData;
}

export interface CompanyDetailsContextProps {
   company: CompanyData | null;
   children: React.ReactNode;
}
