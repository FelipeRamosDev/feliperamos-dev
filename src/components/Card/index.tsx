import React, { useMemo, forwardRef } from 'react';
import { parseCSS } from '@/helpers';

interface CardStyleProps {
   radius?: number;
   elevation?: number;
   noRadius?: boolean;
   noElevation?: boolean;
   noPadding?: boolean;
   padding?: 'xs' | 's' | 'm' | 'l' | 'xl' | '';
   shadowColor?: string;
   style?: React.CSSProperties;
}

interface CardBaseProps {
   key?: React.Key;
   className?: string | string[] | undefined;
   children?: React.ReactNode;
}

type CardProps = CardStyleProps & CardBaseProps;

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
   let { elevation = 50, padding = 's' } = props;

   const {
      radius = 5,
      noRadius = false,
      noElevation = false,
      noPadding = false,
      shadowColor = '#222222',
      className = [],
      style,
      children
   } = props;

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
      <div ref={ref} className={css} style={styleComp}>
         {children}
      </div>
   );
});

Card.displayName = 'Card';
export default Card;
