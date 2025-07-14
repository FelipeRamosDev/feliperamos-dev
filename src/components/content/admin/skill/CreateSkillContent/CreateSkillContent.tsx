import { Container } from '@/components/common';
import CreateSkillForm from '@/components/forms/CreateSkillForm/CreateSkillForm';
import { PageHeader } from '@/components/headers';

export default function CreateSkillContent() {
   return (
      <div className="CreateSkillContent">
         <PageHeader
            title="Create Skill"
            description="Fill out the form below to create a new skill."
         />

         <Container>
            <CreateSkillForm />
         </Container>
      </div>
   );
}
