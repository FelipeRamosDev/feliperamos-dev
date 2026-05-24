import { FlexLine } from '@/components/common';
import { useChatManager } from '@/contexts/ChatManager/ChatManager';
import { FormSubmit } from '@/hooks';
import { useForm } from '@/hooks/Form/Form';
import { useGenLetterContext } from '@/hooks/useGenLetter/GenLetterContext';
import { GenerateLetterParams } from '@/hooks/useGenLetter/useGenLetter.types';
import { Button } from '@mui/material';

export default function BuildCoverLetterButtons({ opportunityId }: Partial<GenerateLetterParams>) {
   const { values } = useForm<GenerateLetterParams>();
   const { generateLetter } = useGenLetterContext();
   const { chat } = useChatManager();

   const regenerateLetter = () => {
      if (!opportunityId) {
         console.error('Opportunity ID is required to generate a cover letter.');
         return;
      }

      generateLetter({
         opportunityId,
         agentId: 'letter-gen',
         roomId: chat?.roomId || '',
         prompt: values.prompt || ''
      });
   }

   return (
      <FlexLine>
         <Button type="button" title="Generate Cover Letter" onClick={regenerateLetter}>Generate Letter</Button>
         <FormSubmit label="Save Letter" fullWidth={false} />
      </FlexLine>
   );
}
