import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import { ContentSidebar } from '@/components/layout';
import AdminDashboardArticle from './sections/AdminDashboardArticle/AdminDashboardArticle';
import AdminDashboardSidebar from './sections/AdminDashboardSidebar/AdminDashboardSidebar';

export default function AdminDashboardContent(): React.ReactElement {
   return (
      <div className="AdminDashboardContent">
         <PageHeader
            title="Admin Dashboard"
            description="This is the admin dashboard where you can manage the application settings and user data."
         />

         <section>
            <Container>
               <ContentSidebar>
                  <AdminDashboardArticle />
                  <AdminDashboardSidebar />
               </ContentSidebar>
            </Container>
         </section>
      </div>
   );
}
