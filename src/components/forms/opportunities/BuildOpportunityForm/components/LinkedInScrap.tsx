import { Card } from '@/components/common';
import { WidgetHeader } from '@/components/headers';
import { FormInput } from '@/hooks';
import { Button } from '@mui/material';
import { useSocket } from '@/services/SocketClient';
import styles from '../BuildOpportunityForm.module.scss';
import { useForm } from '@/hooks/Form/Form';
import { useEffect, useState } from 'react';

import type {
   ScrapLinkedInJobError,
   ScrapLinkedInJobResponse
} from '../BuildOpportunityForm.types';
import LoadingModal from '@/components/modals/LoadingModal/LoadingModal';

export default function LinkedInScrap() {
   const { emit, socket, isConnected } = useSocket();
   const { getValue, setFieldValue, setResponseError } = useForm();
   const [ loading, setLoading ] = useState<boolean>(false);
   const [ scrapeStatus, setScrapeStatus ] = useState<string>('Scraping job information from LinkedIn...');

   useEffect(() => {
      if (!socket || !isConnected) return;

      socket.on('opportunities:scrape-linkedin-job:status', (status) => {
         switch (status) {
            case 'fetching-url':
               setScrapeStatus('Scraping job information from LinkedIn...');
               break;
            case 'error':
               setScrapeStatus('Error fetching job information from LinkedIn.');
               break;
         }
      });
   }, [socket, isConnected])

   const scrapeLinkedInJob = () => {
      const jobURL = getValue('jobURL');
      if (!jobURL) {
         return;
      }

      setLoading(true);
      emit('scrape-linkedin-job', { jobURL }, (response) => {
         const { error, message } = response as ScrapLinkedInJobError;
         const { jobDescription, jobTitle, jobCompany, jobLocation, jobSeniority, jobEmploymentType } = response as ScrapLinkedInJobResponse;

         setLoading(false);
         if (error) {
            console.error('Scrap LinkedIn Job Error:', { error, message });
            setResponseError({ message });
            return;
         }

         setFieldValue('jobURL', jobURL);
         setFieldValue('jobTitle', jobTitle);
         setFieldValue('jobCompany', jobCompany);
         setFieldValue('jobDescription', jobDescription);
         setFieldValue('jobLocation', jobLocation);
         setFieldValue('jobSeniority', jobSeniority);
         setFieldValue('jobEmploymentType', jobEmploymentType);
      });
   };

   return (
      <Card className={styles.jobScrap}>
         <WidgetHeader title="LinkedIn Job Scraping" />

         <FormInput
            fieldName="jobURL"
            label="Job URL"
            placeholder="Enter the LinkedIn job URL"
         />

         {getValue('jobURL') ? (
            <Button
               className="background-button"
               fullWidth
               variant="text"
               loading={loading}
               onClick={scrapeLinkedInJob}
            >Scrape Job Infos</Button>
         ) : ''}

         <LoadingModal isOpen={loading} message={scrapeStatus} />
      </Card>
   );
}
