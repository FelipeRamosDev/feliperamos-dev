import { CompaniesWidget, LanguagesWidget, SkillsWidget } from '@/components/widgets';

export default function DashboardSidebar(): React.ReactElement {
   return (<>
      <SkillsWidget className="sidebar-item" />
      <CompaniesWidget className="sidebar-item" />
      <LanguagesWidget className="sidebar-item" />
   </>);
}
