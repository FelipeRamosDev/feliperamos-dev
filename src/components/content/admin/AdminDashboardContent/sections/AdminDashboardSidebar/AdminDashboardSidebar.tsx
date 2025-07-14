import { Button } from '@mui/material';

export default function AdminDashboardSidebar(): React.ReactElement {
   return (<>
      <div className="skills">
         <h2>Skills</h2>

         <Button variant="contained" color="primary">Add Skill</Button>
      </div>
   </>);
}
