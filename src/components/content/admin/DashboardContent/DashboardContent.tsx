import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import { ContentSidebar } from '@/components/layout';
import DashboardArticle from './sections/DashboardArticle/DashboardArticle';
import DashboardSidebar from './sections/DashboardSidebar/DashboardSidebar';

export default function DashboardContent(): React.ReactElement {
   return (
      <div className="DashboardContent">
         <PageHeader
            title="Admin Dashboard"
            description="This is the admin dashboard where you can manage the application settings and user data."
         />

         <section>
            <Container>
               <ContentSidebar>
                  <DashboardArticle />
                  <DashboardSidebar />
               </ContentSidebar>
            </Container>
         </section>
      </div>
   );
}
