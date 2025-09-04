import { Form } from '@/hooks';
import LinkedInScrap from './components/LinkedInScrap';
import JobDetails from './components/JobDetails';
import GenerateSummary from './components/GenerateSummary';
import { FormValues } from '@/hooks/Form/Form.types';
import { useAjax } from '@/hooks/useAjax';
import { OpportunityData } from '@/types/database.types';

export default function BuildOpportunityForm() {
   const ajax = useAjax();

   const createOpportunity = async (values: FormValues) => {
      try {
         const created = await ajax.post<OpportunityData>('/opportunity/create', {
            jobUrl: values.jobUrl,
            jobTitle: values.jobTitle,
            jobDescription: values.jobDescription,
            jobLocation: values.jobLocation,
            jobSeniority: values.jobSeniority,
            jobEmploymentType: values.jobEmploymentType,
            companyName: values.jobCompany,
            cvSummary: values.currentInput,
            cvTemplate: values.cvTemplate
         });

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
