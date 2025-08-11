import { CVsWidget, ExperiencesWidget, EducationsWidget } from '@/components/widgets';

export default function DashboardArticle(): React.ReactElement {
   return (<>
      <CVsWidget />
      <ExperiencesWidget />
      <EducationsWidget />
   </>);
}
