import { Card, Container, Markdown } from '@/components/common';
import { useCVPDFTemplate } from '../CVPDFTemplateContext';
import styles from '../CVPDFTemplateContent.module.scss';
import { parseCSS } from '@/helpers/parse.helpers';
import { CardProps } from '@/components/common/Card/Card.types';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVPDFTemplateContext.text';
import Link from 'next/link';
import { WatchLater, Web } from '@mui/icons-material';
import { ExperienceData } from '@/types/database.types';

export default function CVPDFExperiences(): React.ReactElement {
   const cv = useCVPDFTemplate();
   const { textResources } = useTextResources(texts);
   const experiences = cv.cv_experiences?.sort((a, b) => {
      if (a.end_date && b.end_date) {
         return a.end_date < b.end_date ? 1 : -1;
      }

      return 0;
   }) || [];

   const CSS = parseCSS('CVPDFExperiences', styles.CVPDFExperiences);
   const cardProps: CardProps = { elevation: 'none', padding: 'm' };

   const experienceTitle = (experience: ExperienceData) => {
      const position = experience.position || '';
      const companyName = experience.company?.company_name || '';

      if (!position || !companyName) {
         console.warn('Experience position or company name is missing');
         return '';
      }

      return textResources.getText('CVPDFExperiences.experienceHeader.title', position, companyName);
   }

   return (
      <section className={CSS}>
         <Container fullwidth>
            <h2>{textResources.getText('CVPDFExperiences.experiences.title')}</h2>
            <hr />

            {experiences?.length ? (
               <ul>
                  {experiences.map((experience, index) => (
                     <li key={index} className={styles.experienceItem}>
                        <Card className={styles.experienceHeader} {...cardProps}>
                           <h3>{experienceTitle(experience)}</h3>

                           <p className={styles.verticalAligned}>
                              <WatchLater fontSize="small" />

                              {textResources.getText(
                                 'CVPDFExperiences.experienceHeader.experienceTime',
                                 String(experience.start_date),
                                 String(experience.end_date)
                              )}
                              {' '}
                              {textResources.getText(
                                 'CVPDFExperiences.experienceHeader.timeDifference',
                                 String(experience.start_date),
                                 String(experience.end_date)
                              )}
                           </p>

                           {experience.company?.site_url && (
                              <Link
                                 className={styles.verticalAligned}
                                 href={experience.company?.site_url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                              >
                                 <Web fontSize="small" />
                                 {experience.company?.site_url}
                              </Link>
                           )}

                           <ul className={styles.chipsList}>
                              {experience.skills?.map((skill, index) => (
                                 <li key={index}>{skill.name}</li>
                              ))}
                           </ul>
                        </Card>

                        <Card className={styles.experienceDetails} {...cardProps}>
                           <ContentSidebar breakpoint="m">
                              {(experience.summary || experience.description) && (
                                 <Fragment>
                                    {experience.summary && (
                                       <Markdown className={styles.markdown} value={experience.summary} />
                                    )}

                                    {experience.description && (
                                       <Markdown className={styles.markdown} value={experience.description} />
                                    )}
                                 </Fragment>
                              )}

                              {experience.responsibilities && (
                                 <Fragment>
                                    <Markdown className={styles.markdown} value={experience.responsibilities} />
                                 </Fragment>
                              )}
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
