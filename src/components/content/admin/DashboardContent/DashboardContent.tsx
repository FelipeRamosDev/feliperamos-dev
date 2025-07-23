'use client';

import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import { ContentSidebar } from '@/components/layout';
import DashboardArticle from './sections/DashboardArticle/DashboardArticle';
import DashboardSidebar from './sections/DashboardSidebar/DashboardSidebar';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from './DashboardContent.text'

export default function DashboardContent(): React.ReactElement {
   const { textResources } = useTextResources(texts);

   return (
      <div className="DashboardContent">
         <PageHeader
            title={textResources.getText('DashboardContent.pageHeader.title')}
            description={textResources.getText('DashboardContent.pageHeader.description')}
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
