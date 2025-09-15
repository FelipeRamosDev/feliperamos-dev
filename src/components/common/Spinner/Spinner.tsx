import React from 'react';
import { parseCSS } from '@/helpers/parse.helpers';
import { SpinnerProps } from './Spinner.types';

/**
 * Spinner component for displaying a loading indicator.
 *
 * @param {SpinnerProps} props
 * @param {string} [props.size='3rem'] - the size o spinner represents the height and width of the spinner circle.
 * @param {string} [props.wrapperHeight='4rem'] - the height of the wrapper that contains the spinner.
 * @returns {React.JSX.Element}
 */
export default function Spinner({ className = '', wrapperHeight, size = '3rem', message }: SpinnerProps): React.JSX.Element {
   const classNames = parseCSS(className, 'Spinner');
   const wrapperProps = {
      className: classNames,
      style: { height: wrapperHeight || size }
   };

   const circleProps = {
      className: 'spinner__circle',
      style: { height: size, width: size }
   };

   return (<>
      <div {...wrapperProps}>
         <div {...circleProps}></div>
      </div>
      {message && <p className="spinner__message">{message}</p>}
   </>);
}
