import { Form } from '@/hooks';
import LinkedInScrap from './components/LinkedInScrap';
import JobDetails from './components/JobDetails';
import GenerateSummary from './components/GenerateSummary';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { OpportunityData } from '@/types/database.types';
import { useRouter } from 'next/navigation';

export default function BuildOpportunityForm() {
   const ajax = useAjax();
   const router = useRouter();

   const createOpportunity = async (values: FormValues) => {
      try {
         const created = await ajax.post<OpportunityData>('/opportunity/create', {
            jobURL: values.jobURL,
            jobTitle: values.jobTitle,
            jobDescription: values.jobDescription,
            jobLocation: values.jobLocation,
            jobSeniority: values.jobSeniority,
            jobEmploymentType: values.jobEmploymentType,
            companyName: values.jobCompany,
            cvSummary: values.currentInput,
            cvTemplate: values.cvTemplate
         });

         if (created.error) {
            return created;
         }

         router.push(`/admin/opportunity/search`);
         return created;
      } catch (error) {
         console.error('Error creating opportunity:', error);
         return error;
      }
   }

   return (<>
      <Form onSubmit={createOpportunity}>
         <LinkedInScrap />
         <JobDetails />
         <GenerateSummary />
      </Form>
   </>);
}
