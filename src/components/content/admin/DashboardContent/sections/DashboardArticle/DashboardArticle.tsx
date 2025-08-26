import { CVsWidget, ExperiencesWidget, EducationsWidget, CustomCVWidget, CVsTableWidget } from '@/components/widgets';

export default function DashboardArticle(): React.ReactElement {
   return (<>
      <CustomCVWidget />
      <CVsWidget hideHeader isFavorite />
      <CVsTableWidget />
      <ExperiencesWidget />
      <EducationsWidget />
   </>);
}
