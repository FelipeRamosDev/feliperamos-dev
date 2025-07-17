'use client';

import { PageHeader } from '@/components/headers';
import { ExperienceDetailsContentProps } from './ExperienceDetailsContent.types';
import ExperienceDetailsProvider from './ExperienceDetailsContext';
import { Card, Container } from '@/components/common';
import { parseCSS } from '@/utils/parse';
import styleModule from './ExperienceDetailsContent.module.scss';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import { SkillBadge } from '@/components/badges';
import TabsContent from '@/components/layout/TabsContent/TabsContent';
import { TabOption } from '@/components/layout/TabsContent/TabsContent.types';

function FieldWrap({ vertical, children }: { vertical?: boolean; children: React.ReactNode }) {
   const CSS = parseCSS(vertical ? styleModule.vertical : 'horizontal', styleModule['field-wrap']);
   return <div className={CSS}>{children}</div>;
}

function SectionCard({ children }: { children: React.ReactNode }) {
   return <Card padding="l">{children}</Card>;
}

export default function ExperienceDetailsContent({ experience }: ExperienceDetailsContentProps): React.ReactElement {
   const classes = parseCSS('ExperienceDetailsContent', styleModule.ExperienceDetailsContent);
   const tabOptions: TabOption[] = [
      { label: 'English (Default)', value: 'en' }
   ];

   return (
      <ExperienceDetailsProvider experience={experience}>
         <div className={classes}>
            <PageHeader
               title="Experience Details"
               description="View and manage the details of your experience."
            />

            <section>
               <Container>
                  <ContentSidebar>
                     <Fragment>
                        <SectionCard>
                           <h2>Experience Details</h2>

                           <FieldWrap>
                              <label>Company:</label>
                              <p>{experience.company?.company_name}</p>
                           </FieldWrap>
                           <FieldWrap>
                              <label>Type:</label>
                              <p>{experience.type}</p>
                           </FieldWrap>
                           <FieldWrap>
                              <label>Start Date:</label>
                              <p>{new Date(experience.start_date).toLocaleDateString()}</p>
                           </FieldWrap>
                           <FieldWrap>
                              <label>End Date:</label>
                              <p>{new Date(experience.end_date).toLocaleDateString()}</p>
                           </FieldWrap>
                        </SectionCard>

                        <SectionCard>
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
                        </SectionCard>
                     </Fragment>

                     <Fragment>
                        <SectionCard>
                           <FieldWrap>
                              <label>ID:</label>
                              <p>{experience.id}</p>
                           </FieldWrap>
                           <FieldWrap>
                              <label>Status:</label>
                              <p>{experience.status}</p>
                           </FieldWrap>
                        </SectionCard>

                        <SectionCard>
                           <h2>Skills</h2>

                           <FieldWrap>
                              {experience.skills.length > 0 ? (
                                 experience.skills.map((skill) => (
                                    <SkillBadge key={skill.skill_id} value={skill.name} />
                                 ))
                              ) : (
                                 <p>No skills associated with this experience.</p>
                              )}
                           </FieldWrap>
                        </SectionCard>
                     </Fragment>
                  </ContentSidebar>
               </Container>
            </section>
         </div>
      </ExperienceDetailsProvider>
   );
}
