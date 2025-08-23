import { CVsWidget, ExperiencesWidget, EducationsWidget, CustomCVWidget } from '@/components/widgets';

export default function DashboardArticle(): React.ReactElement {
   return (<>
      <CustomCVWidget />
      <CVsWidget />
      <ExperiencesWidget />
      <EducationsWidget />
   </>);
}
