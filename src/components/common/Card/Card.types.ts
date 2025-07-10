import { SizeKeyword } from '@/utils/parse';
import React from 'react';

export interface CardStyleProps {
   radius?: SizeKeyword;
   elevation?: number;
   noRadius?: boolean;
   noElevation?: boolean;
   noPadding?: boolean;
   padding?: SizeKeyword;
   shadowColor?: string;
   style?: React.CSSProperties;
}

export interface CardBaseProps {
   key?: React.Key;
   className?: string | string[] | undefined;
   testId?: string;
   children?: React.ReactNode;
}

export type CardProps = CardStyleProps & CardBaseProps;
