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

                           <Link
                              className={styles.verticalAligned}
                              href={experience.company?.site_url}
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              <Web fontSize="small" />
                              {experience.company?.site_url}
                           </Link>

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
                                 <Markdown className={styles.markdown} value={experience.summary} />

                                 <h4>{textResources.getText('CVPDFExperiences.experiences.description')}</h4>
                                 <Markdown className={styles.markdown} value={experience.description} />
                              </Fragment>
                              <Fragment>
                                 <h4>{textResources.getText('CVPDFExperiences.experiences.responsibilities')}</h4>
                                 <Markdown className={styles.markdown} value={experience.responsibilities} />
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
