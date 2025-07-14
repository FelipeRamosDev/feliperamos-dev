import { Button } from '@mui/material';
import Link from 'next/link';

export default function DashboardSidebar(): React.ReactElement {
   return (<>
      <div className="skills">
         <h2>Skills</h2>

         <Link href="/admin/skill/create">
            <Button variant="contained" color="primary">Add Skill</Button>
         </Link>
      </div>
   </>);
}
