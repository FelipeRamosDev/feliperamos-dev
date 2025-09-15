import { Card, DateView, FlexLine, Markdown, ModalBase } from '@/components/common';
import { OpportunityModalProps } from './OpportunityModal.types';
import { ContentSidebar, DataContainer } from '@/components/layout';
import { Fragment, useEffect, useState } from 'react';
import { WidgetHeader, OpportunityHeader } from '@/components/headers';
import { RequestQuote } from '@mui/icons-material';
import { cvPDFDownloadLink } from '@/helpers/app.helpers';
import { Button } from '@mui/material';
import Link from 'next/link';
import { allowedLanguages, languageNames } from '@/app.config';
import styles from './OpportunityModal.module.scss';
import { CVTile } from '@/components/tiles';
import { useRouter } from 'next/navigation';
import { EditOpportunityForm } from '@/components/forms/opportunities';
import { LetterData, OpportunityData } from '@/types/database.types';
import CoverLetterModal from '../CoverLetterModal/CoverLetterModal';

export default function OpportunityModal({ isOpen, onClose, data, updateData = () => { } }: OpportunityModalProps) {
   const [editMode, setEditMode] = useState(false);
   const [coverLetterModal, setCoverLetterModal] = useState(false);
   const router = useRouter();

   if (!data) {
      return null;
   }

   const isCVExists = data?.relatedCV && data.relatedCV !== null;

   const successUpdate = (newData: OpportunityData) => {
      setEditMode(false);
      updateData(newData);
   }

   const successCoverLetter = (newData: LetterData) => {
      updateData({ ...data, coverLetter: newData });

   }

   return (
      <ModalBase
         className={styles.OpportunityModal}
         isOpen={isOpen}
         onClose={onClose}
         title={<><RequestQuote /> Opportunity Details</>}
         widthSize="xl"
      >
         <OpportunityHeader
            opportunityId={data.id}
            editMode={editMode}
            setEditMode={setEditMode}
            company={data.company}
            jobTitle={data.job_title}
         />

         <ContentSidebar>
            {editMode && <EditOpportunityForm opportunity={data} updateData={successUpdate} />}
            {!editMode && <Fragment>
               <Card>
                  <DataContainer vertical>
                     <label>Job URL</label>
                     <Link href={data.job_url || '#'} target="_blank" rel="noopener noreferrer">{data.job_url || '---'}</Link>
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
            </Fragment>}

            <Fragment>
               <Card>
                  <WidgetHeader title="Cover Letter" />

                  <h3>{data.coverLetter?.subject || '---'}</h3>
                  <p>{data.coverLetter?.body || '---'}</p>

                  <Button
                     fullWidth
                     onClick={() => setCoverLetterModal(true)}
                  >
                     Generate with AI
                  </Button>

                  <CoverLetterModal
                     isOpen={coverLetterModal}
                     onClose={() => setCoverLetterModal(false)}
                     onSuccess={successCoverLetter}
                     opportunityId={data.id}
                     companyId={data.company?.id}
                  />
               </Card>

               <Card>
                  <WidgetHeader title="Custom CV" />

                  {isCVExists ? (<>
                     <div className={styles.cvLinks}>
                        {allowedLanguages.map(lang => (
                           <Button
                              key={lang}
                              LinkComponent={Link}
                              className={styles.button}
                              href={cvPDFDownloadLink(data.relatedCV, lang)}
                              rel="noopener noreferrer"
                              target="_blank"
                           >
                              {languageNames[lang]}
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
