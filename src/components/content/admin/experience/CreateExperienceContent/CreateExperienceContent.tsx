import { PageHeader } from '@/components/headers';
import { Container } from '@/components/common';
import CreateExperienceForm from '@/components/forms/CreateExperienceForm/CreateExperienceForm';

export default function CreateExperienceContent() {
   return (
      <div className="CreateExperienceContent">
         <PageHeader
            title="Create Experience"
            description="Fill in the details to create a new experience."
         />

         <Container>
            <CreateExperienceForm />
         </Container>
      </div>
   );
}
