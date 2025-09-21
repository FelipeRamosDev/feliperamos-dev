import { Form, useOpportunities } from '@/hooks';
import LinkedInScrap from './components/LinkedInScrap';
import JobDetails from './components/JobDetails';
import GenerateSummary from './components/GenerateSummary';
import { useRouter } from 'next/navigation';
import { OpportunityCreateParams } from '@/hooks/useOpportinities/useOpportunities.types';

export default function BuildOpportunityForm() {
   const { createOpportunity } = useOpportunities();
   const router = useRouter();

   const create = async (values: Partial<OpportunityCreateParams>) => {
      try {
         const created = await createOpportunity(values);

         router.push(`/admin/opportunity/search?opportunity_id=${created.id}`);
         return created;
      } catch (error) {
         return error;
      }
   }

   return (<>
      <Form<OpportunityCreateParams> onSubmit={create}>
         <LinkedInScrap />
         <JobDetails />
         <GenerateSummary />
      </Form>
   </>);
}
