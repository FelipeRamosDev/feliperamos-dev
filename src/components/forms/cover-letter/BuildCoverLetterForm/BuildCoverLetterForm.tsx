import { Form, FormInput, FormSubmit } from '@/hooks';
import { BuildCoverLetterFormProps } from './BuildCoverLetterForm.types';
import { FlexLine } from '@/components/common';
import { Button } from '@mui/material';
import { LetterData } from '@/types/database.types';
import { useAjax } from '@/hooks/useAjax';

export default function BuildCoverLetterForm({ initialValues, opportunityId, companyId, onSuccess = () => {} }: BuildCoverLetterFormProps) {
   const ajax = useAjax();

   const handleSubmit = async (values: Partial<LetterData>) => {
      if (opportunityId) {
         values.opportunity_id = opportunityId;
      }

      if (companyId) {
         values.company_id = companyId;
      }

      try {
         const created = await ajax.post<LetterData>('/cover-letter/create', values);

         if (created.error) {
            throw new Error(created.message);
         }

         onSuccess(created.data as LetterData);
         return created;
      } catch (error) {
         return error;
      }
   }

   return (
      <Form<LetterData>
         initialValues={initialValues}
         onSubmit={handleSubmit}
         hideSubmit
      >
         <FormInput
            fieldName="subject"
            label="Subject"
         />

         <FormInput
            fieldName="body"
            label="Letter Body"
            minRows={5}
            maxRows={20}
            multiline
         />

         <FormInput
            fieldName="additionalMessage"
            label="Additional Prompt"
            minRows={1}
            multiline
         />

         <FlexLine>
            <Button title="Generate Cover Letter">Generate Letter</Button>
            <FormSubmit label="Save Letter" fullWidth={false} />
         </FlexLine>
      </Form>
   );
}
