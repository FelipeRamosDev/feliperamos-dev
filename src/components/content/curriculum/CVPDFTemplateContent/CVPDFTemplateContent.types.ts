import { CVData } from "@/types/database.types";

export interface CVPDFTemplateContentProps {
   cv: CVData;
}

export interface CVPDFTemplateContextProps {
   cv: CVData;
   children: React.ReactNode;
}

export interface CVPDFHeaderProps {
   className?: string;
}
