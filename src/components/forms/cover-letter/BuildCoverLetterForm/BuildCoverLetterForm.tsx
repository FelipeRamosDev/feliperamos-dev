import { Form, FormInput, useLetters } from '@/hooks';
import { BuildCoverLetterFormProps } from './BuildCoverLetterForm.types';
import { LetterData } from '@/types/database.types';
import BuildCoverLetterButtons from './BuildCoverLetterButtons';

export default function BuildCoverLetterForm({ initialValues, opportunityId, companyId, onSuccess = () => {} }: BuildCoverLetterFormProps) {
   const { createLetter } = useLetters();

   const handleSubmit = async (values: Partial<LetterData>) => {
      values.type = 'cover-letter';

      if (opportunityId) {
         values.opportunity_id = opportunityId;
      }

      if (companyId) {
         values.company_id = companyId;
      }

      try {
         const created = await createLetter(values);

         onSuccess(created);
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
            fieldName="prompt"
            label="Additional Prompt"
            minRows={1}
            multiline
         />

         <BuildCoverLetterButtons opportunityId={opportunityId} />
      </Form>
   );
}
