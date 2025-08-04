'use client';

import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import aboutMeText from './AboutMe.text';
import { Container, DateView, Markdown } from '@/components/common';
import { CVData } from '@/types/database.types';
import styles from './AboutMe.module.scss';
import { ContentSidebar } from '@/components/layout';
import { Fragment } from 'react';
import Image from 'next/image';

export default function AboutMe({ cv }: { cv: CVData }): React.ReactElement {
   const { textResources } = useTextResources(aboutMeText);

   return (
      <section className={styles.AboutMe} data-testid="about-me-section">
         <Container>
            <ContentSidebar className={styles.contentFlex}>
               <div className={styles.avatar}>
                  <Image
                     src={'/images/user-avatar.jpg'}
                     alt={cv.user?.name + ' User Avatar'}
                     width={200}
                     height={200}
                  />
               </div>

               <Fragment>
                  <h2 className={styles.sectionTitle}>{cv.user?.name}</h2>
                  <p className={styles.jobTitle}>{cv.job_title}</p>
                  <p className={styles.experienceTime}>
                     {textResources.getText('AboutMe.experienceTime', Number(cv.experience_time || 0).toFixed(0) || '')}
                  </p>

                  <Markdown className={styles.aboutMeContent} value={cv.summary} />
               </Fragment>
            </ContentSidebar>
         </Container>
      </section>
   );
}
