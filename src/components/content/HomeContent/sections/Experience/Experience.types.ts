import { ExperienceData } from "@/types/database.types";
import { StaticImageData } from "next/image";

export interface ExperienceItemProps {
   experience?: ExperienceData;
}

export interface ExperienceProps {
   experiences: ExperienceData[];
}

export interface WorkExperienceModel {
   company: string;
   companyUrl?: string;
   workType: 'Contract' | 'Fulltime' | 'Part-time' | 'Internship' | 'Freelance';
   position: string;
   startDate: string;
   endDate: string;
   description: string;
   sidebar: string;
   logoUrl?: string;
   thumbUrl?: StaticImageData;
   skills?: string[];
}