import { Container } from '@/components/common';
import { PageHeaderProps } from './PageHeader.types';

export default function PageHeader({ title, description, children }: PageHeaderProps): React.ReactElement {
   return (
      <div className="PageHeader">
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
