import { FlexLine } from "@/components/common";
import { FormSubmit, useGenLetter } from "@/hooks";
import { useForm } from "@/hooks/Form/Form";
import { GenerateLetterParams } from "@/hooks/useGenLetter/useGenLetter.types";
import { Button } from "@mui/material";

export default function BuildCoverLetterButtons({ opportunityId }: Partial<GenerateLetterParams>) {
   const { values } = useForm();
   const { generateLetter } = useGenLetter();
   const { aiThreadID, currentLetter, additionalMessage } = values as Partial<GenerateLetterParams>;

   const regenerateLetter = () => {
      if (!opportunityId) {
         console.error('Opportunity ID is required to generate a cover letter.');
         return;
      }

      generateLetter({
         opportunityId,
         additionalMessage,
         aiThreadID,
         currentLetter
      });
   }

   return (
      <FlexLine>
         <Button title="Generate Cover Letter" onClick={regenerateLetter}>Generate Letter</Button>
         <FormSubmit label="Save Letter" fullWidth={false} />
      </FlexLine>
   );
}
