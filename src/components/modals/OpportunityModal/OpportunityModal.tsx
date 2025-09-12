import { Card, DateView, FlexLine, Markdown, ModalBase } from '@/components/common';
import { OpportunityModalProps } from './OpportunityModal.types';
import { ContentSidebar, DataContainer } from '@/components/layout';
import { Fragment } from 'react';
import { WidgetHeader } from '@/components/headers';
import { RequestQuote } from '@mui/icons-material';
import { cvPDFDownloadLink } from '@/helpers/app.helpers';
import { Button } from '@mui/material';
import Link from 'next/link';
import { allowedLanguages, languageNames } from '@/app.config';
import { CVData } from '@/types/database.types';
import styles from './OpportunityModal.module.scss';
import { CVTile } from '@/components/tiles';
import { useRouter } from 'next/navigation';

export default function OpportunityModal({ isOpen, onClose, data }: OpportunityModalProps) {
   const router = useRouter();

   if (!data) {
      return null;
   }

   return (
      <ModalBase
         className={styles.OpportunityModal}
         isOpen={isOpen}
         onClose={onClose}
         title={<><RequestQuote /> Opportunity Details</>}
         widthSize="xl"
      >
         <ContentSidebar>
            <Fragment>
               <Card>
                  <DataContainer>
                     <label>Job Title</label>
                     <p>{data.job_title}</p>
                  </DataContainer>
                  <DataContainer>
                     <label>Job URL</label>
                     <p>{data.job_url || '---'}</p>
                  </DataContainer>
               </Card>
               <Card>
                  <FlexLine>
                     <DataContainer vertical>
                        <label>Created At</label>
                        <DateView date={data.created_at || '---'} />
                     </DataContainer>
                     <DataContainer vertical>
                        <label>Location</label>
                        <p>{data.location || '---'}</p>
                     </DataContainer>
                  </FlexLine>

                  <FlexLine>
                     <DataContainer vertical>
                        <label>Employment Type</label>
                        <p>{data.employment_type || '---'}</p>
                     </DataContainer>
                     <DataContainer vertical>
                        <label>Seniority Level</label>
                        <p>{data.seniority_level || '---'}</p>
                     </DataContainer>
                  </FlexLine>
               </Card>

               <Card>
                  <DataContainer vertical>
                     <label>Job Description</label>
                     <Markdown value={data.job_description || '---'} />
                  </DataContainer>
               </Card>
            </Fragment>

            <Fragment>
               <Card>
                  <WidgetHeader title="Cover Letter" />
               </Card>
               <Card>
                  <WidgetHeader title="Custom CV" />

                  {data.relatedCV ? (<>
                     <div className={styles.cvLinks}>
                        {allowedLanguages.map(lang => (
                           <Button
                              key={lang}
                              LinkComponent={Link}
                              className={styles.button}
                              href={cvPDFDownloadLink(data.relatedCV as CVData, lang)}
                              target="_blank" rel="noopener noreferrer"
                           >
                              {languageNames[lang] || lang.toUpperCase()}
                           </Button>
                        ))}
                     </div>

                     <CVTile cv={data.relatedCV} onClick={() => router.push(`/admin/curriculum/${data.relatedCV?.id}`)} />
                  </>) : (
                     <p>No CV attached.</p>
                  )}

               </Card>
            </Fragment>
         </ContentSidebar>
      </ModalBase>
   );
}
