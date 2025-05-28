import React, { useMemo } from 'react';
import { parseCSS } from '@/helpers';

type CardProps = {
   radius?: number;
   elevation?: number;
   noRadius?: boolean;
   noElevation?: boolean;
   noPadding?: boolean;
   padding?: 'xs'|'s'|'m'|'l'|'xl'|'';
   shadowColor?: string;
   style?: object;
   className?: string | undefined;
   children?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
   radius = 5,
   elevation = 50,
   noRadius = false,
   noElevation = false,
   noPadding = false,
   padding = 's',
   shadowColor = '#222222',
   className = [],
   style,
   children,
   ...props
}) => {
   const styleComp = {
      borderRadius: `${radius}px`,
      boxShadow: `0 0 ${elevation}px ${shadowColor}`,
      ...style
   };

   if (noRadius) {
      styleComp.borderRadius = '';
   }

   if (noElevation) {
      elevation = 0;
      styleComp.boxShadow = '';
   }

   if (noPadding) {
      padding = '';
   }

   const css = useMemo(() => {
      return parseCSS(className, `card padding-${padding}`);
   }, [ className, padding ]);

   return (
      <div className={css} style={styleComp} {...props}>
         {children}
      </div>
   );
};

export default Card;
