import React, { useMemo, forwardRef } from 'react';
import { parsePadding, parseCSS, parseRadius } from '@/utils/parse';
import { CardProps } from './Card.types';

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
   let { elevation = 50, padding = 's' } = props;

   const {
      radius = 's',
      noRadius = false,
      noElevation = false,
      noPadding = false,
      shadowColor = '#222222',
      className = [],
      testId,
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
      padding = 'none';
   }

   const styling = {
      style: styleComp,
      className: useMemo(() => {
         return parseCSS(className, [
            'Card',
            parsePadding(padding),
            parseRadius(radius),
         ]);
      }, [className, padding, radius]),
   };

   return (
      <div ref={ref} data-testid={testId} {...styling}>
         {children}
      </div>
   );
});

Card.displayName = 'Card';
export default Card;
