import { Container } from '@/components/common';
import { PageHeaderProps } from './PageHeader.types';
import { parseCSS } from '@/helpers/parse.helpers';

export default function PageHeader({ className, title, description, children }: PageHeaderProps): React.ReactElement {
   const classes = parseCSS(className, 'PageHeader');

   return (
      <div className={classes}>
         <Container fullwidth>
            <div className="header-container">
               <div className="header-content">
                  <h1 className="header-title">{title}</h1>

                  {description && (
                     <p className="header-description">{description}</p>
                  )}
               </div>

               {children && <div className="header-actions">
                  {children}
               </div>}
            </div>
         </Container>
      </div>
   );
}
