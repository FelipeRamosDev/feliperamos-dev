import { Card, Container, DateView, Markdown } from '@/components/common';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import styles from '../CVPDFTemplateContent.module.scss';
import { parseCSS } from '@/helpers/parse.helpers';
import { CardProps } from '@/components/common/Card/Card.types';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';

export default function CVPDFExperiences(): React.ReactElement {
   const cv = useCVPDFTemplate();
   const CSS = parseCSS('CVPDFExperiences', styles.CVPDFExperiences);
   const cardProps: CardProps = { elevation: 'none', padding: 'm' };

   return (
      <section className={CSS}>
         <div className={styles.sectionTitle}>
            <Container fullwidth>
               <h2>Work Experience</h2>
               <p>Check below a summary of my work experience.</p>
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
                                 <h4>Summary</h4>
                                 <Markdown value={experience.summary} />

                                 <h4>Description</h4>
                                 <Markdown value={experience.description} />
                              </Fragment>
                              <Fragment>
                                 <h4>Responsibilities</h4>
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
