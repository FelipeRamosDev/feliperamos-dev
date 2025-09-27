import { FlexLine } from '@/components/common';
import { FormSubmit } from '@/hooks';
import { useForm } from '@/hooks/Form/Form';
import { useGenLetterContext } from '@/hooks/useGenLetter/GenLetterContext';
import { GenerateLetterParams } from '@/hooks/useGenLetter/useGenLetter.types';
import { Button } from '@mui/material';

export default function BuildCoverLetterButtons({ opportunityId }: Partial<GenerateLetterParams>) {
   const { values } = useForm<GenerateLetterParams>();
   const { generateLetter } = useGenLetterContext();

   const regenerateLetter = () => {
      if (!opportunityId) {
         console.error('Opportunity ID is required to generate a cover letter.');
         return;
      }

      generateLetter({
         opportunityId,
         additionalMessage: values.additionalMessage || '',
         aiThreadID: values.aiThreadID || '',
         currentLetter: values.body || ''
      });
   }

   return (
      <FlexLine>
         <Button title="Generate Cover Letter" onClick={regenerateLetter}>Generate Letter</Button>
         <FormSubmit label="Save Letter" fullWidth={false} />
      </FlexLine>
   );
}
