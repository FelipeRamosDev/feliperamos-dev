import { Button } from '@mui/material';
import Link from 'next/link';
import { ExperiencesWidget } from '@/components/widgets';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';

export default function DashboardArticle(): React.ReactElement {
   return (<>
      <div className="experience-items">
         <WidgetHeader title="Work Experience">
            <Link href="/admin/experience/create">
               <Button variant="contained" color="primary">Add Experience</Button>
            </Link>
         </WidgetHeader>

         <ExperiencesWidget />
      </div>
   </>);
}
