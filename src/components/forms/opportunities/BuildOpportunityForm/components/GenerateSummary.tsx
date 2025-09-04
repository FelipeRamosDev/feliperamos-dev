import { Card } from '@/components/common';
import { WidgetHeader } from '@/components/headers';
import { FormInput } from '@/hooks';
import { useForm } from '@/hooks/Form/Form';
import { useSocket } from '@/services/SocketClient';
import { Button } from '@mui/material';

export default function GenerateSummary() {
   const { emit } = useSocket();
   const { getValue, setFieldValue } = useForm();

   const currentInput = getValue('currentInput');
   const customPrompt = getValue('customPrompt');
   const jobDescription = getValue('jobDescription');
   const aiThread = getValue('aiThread');

   const generateSummary = () => {
      const payload = { currentInput, customPrompt, jobDescription, aiThread };

      emit('generate-summary', payload, (response) => {
         const { error, message } = response as { error: boolean; message: string };
         const { summary, aiThread } = response as { summary: string; aiThread: string };

         if (error) {
            console.error('Error generating CV summary:', message);
            return;
         }

         setFieldValue('customPrompt', '');
         setFieldValue('currentInput', summary);
         setFieldValue('aiThread', aiThread);
      });
   };

   return (
      <Card>
         <WidgetHeader title="Generate CV Summary" />

         {currentInput ? (
            <FormInput
               fieldName="currentInput"
               label="CV Summary"
               minRows={5}
               multiline
            />
         ) : null}

         <FormInput
            fieldName="customPrompt"
            label="Custom Prompt"
            minRows={1}
            multiline
         />

         <Button
            fullWidth
            variant="text"
            className="background-button"
            onClick={generateSummary}
         >
            Generate Summary
         </Button>
      </Card>
   );
}
