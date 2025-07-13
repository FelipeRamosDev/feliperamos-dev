import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import { ContentSidebar } from '@/components/layout';
import { Button } from '@mui/material';
import Link from 'next/link';
import { Fragment } from 'react';

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
                  <Fragment>
                     <div className="experience-items">
                        <h2>Work Experience</h2>

                        <Link href="/admin/experience/create">
                           <Button variant="contained" color="primary">Add Experience</Button>
                        </Link>
                     </div>
                  </Fragment>

                  <Fragment>
                     <div className="skills">
                        <h2>Skills</h2>

                        <Button variant="contained" color="primary">Add Skill</Button>
                     </div>
                  </Fragment>
               </ContentSidebar>
            </Container>
         </section>
      </div>
   );
}
