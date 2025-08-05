import React from 'react';
import { parseCSS, parsePadding, SizeKeyword } from '@/helpers/parse.helpers';

interface ContainerProps {
   className?: string;
   fullwidth?: boolean;
   padding?: SizeKeyword;
   children: React.ReactNode;
}

/**
 * Renders a layout Container component with optional custom styling.
 *
 * @component
 * @param {ContainerProps} props - The props for the Container component.
 * @param {string} [props.className] - Additional CSS classes to apply to the container.
 * @param {boolean} [props.fullwidth] - Whether the container should be full width.
 * @param {React.ReactNode} props.children - The content to be rendered inside the container.
 *
 * @returns {React.JSX.Element} A div element with container styling.
 */
export default function Container({ className, padding = 'none', fullwidth, children }: ContainerProps): React.JSX.Element {
   const classes = parseCSS(className, [
      'Container',
      fullwidth ? 'fullwidth' : '',
      parsePadding(padding)
   ]);

   return (
      <div className={classes} data-testid="container">
         {children}
      </div>
   );
}
