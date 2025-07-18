import { Card } from "@/components/common";
import TabsContent from "@/components/layout/TabsContent/TabsContent";
import { TabOption } from "@/components/layout/TabsContent/TabsContent.types";
import { useExperienceDetails } from "../ExperienceDetailsContext";
import styleModule from '../ExperienceDetailsContent.module.scss';
import FieldWrap from "./ExperienceDetailsFieldWrap";

export default function ExperienceSetsSection(): React.ReactElement {
   const experience = useExperienceDetails();
   const tabOptions: TabOption[] = [
      { label: 'English (Default)', value: 'en' }
   ];

   return (
      <Card padding="l">
         <TabsContent options={tabOptions}>
            {tabOptions.map((option: TabOption) => {
               const languageSet = experience.languageSets.find(set => set.language_set === option.value);

               if (!languageSet) {
                  return null;
               }

               return (
                  <div className={styleModule.languageSet} key={option.value}>
                     <FieldWrap>
                        <label>Position:</label>
                        <p>{languageSet.position || 'No position available.'}</p>
                     </FieldWrap>
                     <FieldWrap>
                        <label>Slug:</label>
                        <p>{languageSet.slug || 'No slug available.'}</p>
                     </FieldWrap>

                     <FieldWrap vertical>
                        <label>Summary:</label>
                        <p>{languageSet.summary || 'No summary available.'}</p>
                     </FieldWrap>
                     <FieldWrap vertical>
                        <label>Description:</label>
                        <p>{languageSet.description || 'No description available.'}</p>
                     </FieldWrap>
                     <FieldWrap vertical>
                        <label>Responsibilities:</label>
                        <p>{languageSet.responsibilities || 'No responsibilities available.'}</p>
                     </FieldWrap>
                  </div>
               );
            })}
         </TabsContent>
      </Card>
   );
}
