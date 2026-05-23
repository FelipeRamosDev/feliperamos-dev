import { Card } from '@/components/common';
import { WidgetHeader } from '@/components/headers';
import { LoadingModal } from '@/components/modals';
import { useChatManager } from '@/contexts';
import { loadUserCVs } from '@/helpers/database.helpers';
import { FormInput, FormSelect } from '@/hooks';
import { useForm } from '@/hooks/Form/Form';
import { useAjax } from '@/hooks/useAjax';
import { SocketErrorCallback, useSocket } from '@/services/SocketClient';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

export default function GenerateSummary() {
   const { emit, socket, isConnected } = useSocket();
   const { getValue, setFieldValue, setResponseError } = useForm();
   const [generateStatus, setGenerateStatus] = useState<string>();
   const { textResources } = useTextResources();
   const ajax = useAjax();
   const { chat } = useChatManager();
   const roomId = chat?.roomId || '';

   const currentInput = getValue('cvSummary');
   const customPrompt = getValue('customPrompt');
   const jobDescription = getValue('jobDescription');

   useEffect(() => {
      if (!socket || !isConnected) return;

      socket.on('opportunities:generate-summary:status', (status) => {
         switch (status) {
            case 'generating-summary':
               setGenerateStatus('Generating summary');
               break;
            case 'error':
               setGenerateStatus('Error generating summary');
               break;
            default:
               setGenerateStatus('');
               break;
         }
      });
   }, [socket, isConnected]);

   const generateSummary = () => {
      const payload = {
         prompt: customPrompt,
         jobDescription,
         roomId,
         agentId: 'summary-gen'
      };

      emit('generate-summary', payload, (response) => {
         const { error, message } = response as SocketErrorCallback;
         const { summary } = response as { summary: string };

         if (error) {
            console.error('Error generating CV summary:', message);
            setResponseError({ message });
            return;
         }

         setFieldValue('customPrompt', '');
         setFieldValue('cvSummary', summary);
      });
   };

   if (!jobDescription) {
      return null;
   }

   return (
      <Card>
         <WidgetHeader title="Generate CV Summary" />

         <FormSelect
            fieldName="cvTemplate"
            label="CV Template"
            loadOptions={async () => {
               try {
                  const cvs = await loadUserCVs(ajax, textResources);

                  return cvs.map(cv => ({
                     value: Number(cv.id),
                     label: cv.title
                  }));
               } catch (error) {
                  console.error('Error loading CV templates:', error);
                  throw error;
               }
            }}
         />

         {currentInput ? (
            <FormInput
               fieldName="cvSummary"
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

         <LoadingModal isOpen={Boolean(generateStatus)} message={generateStatus} />
      </Card>
   );
}
