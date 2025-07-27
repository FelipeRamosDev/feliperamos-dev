import { CVData } from "@/types/database.types";

export interface CVTileProps {
   className?: string | string[];
   cv: CVData;
   onClick?: (cvId: number) => void;
}
