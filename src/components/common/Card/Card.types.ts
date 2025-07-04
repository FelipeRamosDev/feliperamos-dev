import React from 'react';

export interface CardStyleProps {
   radius?: number;
   elevation?: number;
   noRadius?: boolean;
   noElevation?: boolean;
   noPadding?: boolean;
   padding?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'none';
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
