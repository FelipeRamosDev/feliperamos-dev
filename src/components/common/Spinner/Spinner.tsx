import React from "react";
import { parseCSS } from "@/helpers/parse.helpers";

interface SpinnerProps {
   className?: string;
   wrapperHeight?: string;
   size?: string;
}

/**
 * Spinner component for displaying a loading indicator.
 *
 * @param {SpinnerProps} props
 * @param {string} [props.size='3rem'] - the size o spinner represents the height and width of the spinner circle.
 * @param {string} [props.wrapperHeight='4rem'] - the height of the wrapper that contains the spinner.
 * @returns {React.JSX.Element}
 */
export default function Spinner({ className = '', wrapperHeight, size = '3rem' }: SpinnerProps): React.JSX.Element {
   const classNames = parseCSS(className, 'Spinner');
   const wrapperProps = {
      className: classNames,
      style: { height: wrapperHeight || size }
   };

   const circleProps = {
      className: 'spinner__circle',
      style: { height: size, width: size }
   };

   return (
      <div {...wrapperProps}>
         <div {...circleProps}></div>
      </div>
   );
}
