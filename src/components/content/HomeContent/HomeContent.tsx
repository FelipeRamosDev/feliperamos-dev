import { HomeTopBanner } from '@/components/banners';
import { Experience, Skills } from './sections';
import ajax from '@/hooks/useAjax';
import { ExperienceData, SkillData } from '@/types/database.types';

export default async function HomeContent({ language }: { language: string }): Promise<React.ReactElement> {
   const experiencesData = await ajax.get('/experience/public/user-experiences', { params: { language_set: language } });
   const skillsData = await ajax.get<SkillData[]>('/skill/public/user-skills', { params: { language_set: language } });

   return (
      <div className="HomeContent">
         <HomeTopBanner />

         <Skills skills={skillsData.data as SkillData[]} />
         <Experience experiences={experiencesData.data as ExperienceData[]} />
      </div>
   )
}
