import { Card } from '@/components/common';
import { useExperienceDetails } from '../ExperienceDetailsContext';
import FieldWrap from './ExperienceDetailsFieldWrap';

export default function ExperienceDetailsSection() {
   const experience = useExperienceDetails();

   return (
      <Card padding="l">
         <h2>Experience Details</h2>

         <FieldWrap>
            <label>Company:</label>
            <p>{experience.company?.company_name}</p>
         </FieldWrap>
         <FieldWrap>
            <label>Type:</label>
            <p>{experience.type}</p>
         </FieldWrap>
         <FieldWrap>
            <label>Start Date:</label>
            <p>{new Date(experience.start_date).toLocaleDateString()}</p>
         </FieldWrap>
         <FieldWrap>
            <label>End Date:</label>
            <p>{new Date(experience.end_date).toLocaleDateString()}</p>
         </FieldWrap>
      </Card>
   );
}