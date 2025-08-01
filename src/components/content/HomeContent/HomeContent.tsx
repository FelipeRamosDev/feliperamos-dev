import { HomeTopBanner } from '@/components/banners';
import { Experience, Skills } from './sections';
import ajax from '@/hooks/useAjax';
import { CVData, ExperienceData, SkillData } from '@/types/database.types';

export default async function HomeContent({ language = 'en' }: { language?: string }): Promise<React.ReactElement> {
   const masterCV = await ajax.get<CVData>('/user/master-cv', { params: { language_set: language } });
   const cvData = masterCV.data as CVData;

   return (
      <div className="HomeContent">
         <HomeTopBanner cv={cvData} />

         {cvData && (<>
            <Skills skills={cvData?.cv_skills as SkillData[]} />
            <Experience experiences={cvData?.cv_experiences as ExperienceData[]} />
         </>)}
      </div>
   )
}
