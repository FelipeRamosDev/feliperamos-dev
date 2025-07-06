import { HomeTopBanner } from '@/components/banners';
import { Skills } from './sections';

export default function HomeContent(): React.ReactElement {
   return (
      <div className="HomeContent">
         <HomeTopBanner />
         <Skills />
      </div>
   )
}
