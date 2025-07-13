import { SizeKeyword } from '@/utils/parse';
import React from 'react';

export interface CardProps {
   key?: React.Key;
   className?: string | string[] | undefined;
   testId?: string;
   radius?: SizeKeyword;
   elevation?: SizeKeyword;
   noRadius?: boolean;
   noElevation?: boolean;
   noPadding?: boolean;
   padding?: SizeKeyword;
   shadowColor?: string;
   style?: React.CSSProperties;
   children?: React.ReactNode;
}
