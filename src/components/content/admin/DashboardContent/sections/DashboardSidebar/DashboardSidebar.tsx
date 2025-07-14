import CompaniesWidget from '@/components/widgets/CompaniesWidget/CompaniesWidget';
import SkillsWidget from '@/components/widgets/SkillsWidget/SkillsWidget';

export default function DashboardSidebar(): React.ReactElement {
   return (<>
      <SkillsWidget className="sidebar-item" />
      <CompaniesWidget className="sidebar-item" />
   </>);
}
