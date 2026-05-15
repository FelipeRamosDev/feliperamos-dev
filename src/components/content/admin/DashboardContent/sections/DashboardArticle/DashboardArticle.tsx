import { CVsWidget, CustomCVWidget } from '@/components/widgets';

export default function DashboardArticle(): React.ReactElement {
   return (<>
      <CustomCVWidget />
      <CVsWidget hideHeader isFavorite />
   </>);
}
