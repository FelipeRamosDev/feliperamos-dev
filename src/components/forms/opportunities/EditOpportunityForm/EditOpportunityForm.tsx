import { JSX } from 'react';
import { Card, FlexLine } from '@/components/common';
import { CardProps } from '@/components/common/Card/Card.types';
import { Form, FormInput } from '@/hooks';
import { EditOpportunityFormProps } from './EditOpportunityForm.types';
import { OpportunityData } from '@/types/database.types';

export default function EditOpportunityForm({ opportunity, updateData }: EditOpportunityFormProps): JSX.Element {
   const cardProps: CardProps = { padding: 'm' };

   const handleSubmit = async (data: Partial<OpportunityData>) => {
      if (!updateData) return;

      try {
         return await updateData(opportunity.id, data);
      } catch (error) {
         return error;
      }
   }

   return (
      <Form<OpportunityData>
         initialValues={opportunity}
         submitLabel="Save Changes"
         onSubmit={handleSubmit}
         editMode
      >
         <Card {...cardProps}>
            <FormInput
               fieldName="job_url"
               label="Job URL"
               placeholder="Enter job URL"
            />
         </Card>

         <Card {...cardProps}>
            <FormInput
               fieldName="seniority_level"
               label="Seniority Level"
               placeholder="Enter seniority level"
            />

            <FlexLine>
               <FormInput
                  fieldName="location"
                  label="Location"
                  placeholder="Enter location"
               />
               <FormInput
                  fieldName="employment_type"
                  label="Employment Type"
                  placeholder="Enter employment type"
               />
            </FlexLine>
         </Card>

         <Card {...cardProps}>
            <FormInput
               fieldName="job_description"
               label="Job Description"
               placeholder="Enter job description"
               multiline
               minRows={10}
               maxRows={20}
            />
         </Card>
      </Form>
   );
}
