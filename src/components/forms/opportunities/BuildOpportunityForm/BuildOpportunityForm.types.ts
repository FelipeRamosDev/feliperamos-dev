import { CVData } from "@/types/database.types";

export interface ScrapLinkedInJobParams {
   jobURL: string;
}

export interface ScrapLinkedInJobResponse {
   jobDescription?: string;
   jobTitle?: string;
   jobCompany?: string;
   jobLocation?: string;
   jobSeniority?: string;
   jobEmploymentType?: string;
}

export interface ScrapLinkedInJobError {
   error: boolean;
   message?: string;
}

export interface CustomCVProps {
   userCVs: CVData[];
   setUserCVs: (cvs: CVData[]) => void;
   setSelectedCV: (cvId: number | null) => void;
}
