import { Card } from '@/components/common';
import { WidgetHeader } from '@/components/headers';
import { FormInput } from '@/hooks';
import { Button } from '@mui/material';
import { useSocket } from '@/services/SocketClient';
import styles from '../BuildOpportunityForm.module.scss';
import { useForm } from '@/hooks/Form/Form';
import { useState } from 'react';

import type {
   ScrapLinkedInJobError,
   ScrapLinkedInJobResponse
} from '../BuildOpportunityForm.types';

export default function LinkedInScrap() {
   const { emit } = useSocket();
   const { getValue, setFieldValue, setResponseError } = useForm();
   const [ loading, setLoading ] = useState<boolean>(false);
   const jobURL = getValue('jobURL');

   const scrapeLinkedInJob = () => {
      if (!jobURL) {
         return;
      }

      setLoading(true);
      emit('scrape-linkedin-job', { jobURL }, (response) => {
         const { error, message } = response as ScrapLinkedInJobError;
         const { jobDescription, jobTitle, jobCompany } = response as ScrapLinkedInJobResponse;

         setLoading(false);
         if (error) {
            console.error('Scrap LinkedIn Job Error:', { error, message });
            setResponseError({ message });
            return;
         }

         setFieldValue('jobTitle', jobTitle);
         setFieldValue('jobCompany', jobCompany);
         setFieldValue('jobDescription', jobDescription);
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

         {jobURL ? (
            <Button
               className="background-button"
               fullWidth
               variant="text"
               loading={loading}
               onClick={scrapeLinkedInJob}
            >Scrape Job Infos</Button>
         ) : ''}
      </Card>
   );
}
