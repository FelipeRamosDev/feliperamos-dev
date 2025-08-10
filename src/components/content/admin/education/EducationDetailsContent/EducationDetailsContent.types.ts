import { CardProps } from '@/components/common/Card/Card.types';
import { EducationData } from '@/types/database.types';

export interface EducationDetailsContentProps {
   education: EducationData;
}

export interface EducationDetailsContextProps {
   education: EducationData;
   children: React.ReactNode;
}

export interface EducationDetailsSubcomponentProps {
   cardProps: CardProps;
}
