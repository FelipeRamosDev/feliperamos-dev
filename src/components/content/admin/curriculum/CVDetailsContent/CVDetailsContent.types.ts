import { CardProps } from "@/components/common/Card/Card.types";
import { CVData } from "@/types/database.types";

export interface CVDetailsContentProps {
   cv: CVData;
}

export interface CVDetailsContextProps {
   cv: CVData;
   children: React.ReactNode;
}

export interface CVDetailsSubcomponentProps {
   cardProps: CardProps;
}
