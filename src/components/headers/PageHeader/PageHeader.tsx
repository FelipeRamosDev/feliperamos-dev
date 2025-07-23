import { Container } from '@/components/common';
import { PageHeaderProps } from './PageHeader.types';

export default function PageHeader({ title, description }: PageHeaderProps): React.ReactElement {
   return (
      <div className="PageHeader">
         <Container>
            <h1 className="header-title">{title}</h1>

            {description && (
               <p className="header-description">{description}</p>
            )}
         </Container>
      </div>
   );
}
