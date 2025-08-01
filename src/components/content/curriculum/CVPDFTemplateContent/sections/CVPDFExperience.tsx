import { Card, Container, DateView, Markdown } from '@/components/common';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import styles from '../CVPDFTemplateContent.module.scss';
import { parseCSS } from '@/helpers/parse.helpers';
import { CardProps } from '@/components/common/Card/Card.types';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVPDFTemplateContext.text';

export default function CVPDFExperiences(): React.ReactElement {
   const cv = useCVPDFTemplate();
   const { textResources } = useTextResources(texts);

   const CSS = parseCSS('CVPDFExperiences', styles.CVPDFExperiences);
   const cardProps: CardProps = { elevation: 'none', padding: 'm' };

   return (
      <section className={CSS}>
         <div className={styles.sectionTitle}>
            <Container fullwidth>
               <h2>{textResources.getText('CVPDFExperiences.experiences.title')}</h2>
               <p>{textResources.getText('CVPDFExperiences.experiences.subtitle')}</p>
            </Container>
         </div>

         <Container fullwidth>
            {cv.cv_experiences?.length ? (
               <ul>
                  {cv.cv_experiences.map((experience, index) => (
                     <li key={index}>
                        <Card className={styles.experienceHeader} {...cardProps}>
                           <h3>{experience.position} at {experience.company?.company_name}</h3>
                           <p><DateView date={experience.start_date} /> - <DateView date={experience.end_date} /></p>

                           <ul className={styles.chipsList}>
                              {experience.skills?.map((skill, index) => (
                                 <li key={index}>{skill.name}</li>
                              ))}
                           </ul>
                        </Card>

                        <Card className={styles.experienceDetails} {...cardProps}>
                           <ContentSidebar breakpoint="m">
                              <Fragment>
                                 <h4>{textResources.getText('CVPDFExperiences.experiences.summary')}</h4>
                                 <Markdown value={experience.summary} />

                                 <h4>{textResources.getText('CVPDFExperiences.experiences.description')}</h4>
                                 <Markdown value={experience.description} />
                              </Fragment>
                              <Fragment>
                                 <h4>{textResources.getText('CVPDFExperiences.experiences.responsibilities')}</h4>
                                 <Markdown value={experience.responsibilities} />
                              </Fragment>
                           </ContentSidebar>
                        </Card>
                     </li>
                  ))}
               </ul>
            ) : (
               <p>No experience listed.</p>
            )}
         </Container>
      </section>
   );
}
