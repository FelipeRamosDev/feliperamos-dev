import React, { forwardRef } from 'react';
import { parsePadding, parseCSS, parseRadius, parseElevation } from '@/helpers/parse.helpers';
import { CardProps } from './Card.types';

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
   const {
      radius = 's',
      padding = 's',
      elevation = 's',
      noRadius = false,
      noElevation = false,
      noPadding = false,
      className = [],
      testId,
      children,
      onClick,
      ...others
   } = props;


   const classNames = parseCSS(className, [
      'Card',
      !noPadding ? parsePadding(padding) : '',
      !noRadius ? parseRadius(radius) : '',
      !noElevation ? parseElevation(elevation) : '',
   ]);

   return (
      <div ref={ref} data-testid={testId} className={classNames} onClick={onClick} {...others}>
         {children}
      </div>
   );
});

Card.displayName = 'Card';
export default Card;
