import { ErrorContentProps } from './ErrorContent.types';
import styles from './ErrorContent.module.scss';
import { parseCSS } from '@/helpers/parse.helpers';

export default function ErrorContent({
   className,
   status = 500,
   statusText = 'Internal Server Error',
   code = 'UNKNOWN_ERROR',
   message = 'An unexpected error occurred',
   title,
   children
}: ErrorContentProps) {
   const SCSS = parseCSS(className, [
      'ErrorContent',
      styles.ErrorContent,
   ]);

   return (
      <div className={SCSS}>
         <div className="error-data">
            <h1>{status || 500} | {title || statusText}</h1>
            <p>{message} (<small>{code}</small>)</p>
         </div>

         <div className="error-dynamic-content">
            {children}
         </div>
      </div>
   );
}
