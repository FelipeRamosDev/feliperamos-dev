import React from 'react';
import { TooltipTableHeadProps } from './TableBase.types';

export default function TooltipTableHead({ children, ...props }: TooltipTableHeadProps): React.JSX.Element {
   return (
      <div className="tooltip-head" {...props}>
         {children}
      </div>
   );
}
