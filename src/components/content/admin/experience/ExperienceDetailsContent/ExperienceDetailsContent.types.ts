import { ExperienceData } from "@/types/database.types";

export interface ExperienceDetailsContentProps {
   experience: ExperienceData;
}

export interface ExperienceDetailsContextProps {
   experience: ExperienceData | null;
   children: React.ReactNode;
}
