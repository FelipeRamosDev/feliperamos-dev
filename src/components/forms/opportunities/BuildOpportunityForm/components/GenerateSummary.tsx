import { Card } from '@/components/common';
import { WidgetHeader } from '@/components/headers';
import LoadingModal from '@/components/modals/LoadingModal/LoadingModal';
import { loadUserCVs } from '@/helpers/database.helpers';
import { FormInput, FormSelect } from '@/hooks';
import { useForm } from '@/hooks/Form/Form';
import { useAjax } from '@/hooks/useAjax';
import { useSocket } from '@/services/SocketClient';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

export default function GenerateSummary() {
   const { emit, socket, isConnected } = useSocket();
   const { getValue, setFieldValue, setResponseError } = useForm();
   const [ generateStatus, setGenerateStatus ] = useState<string>();
   const { textResources } = useTextResources();
   const ajax = useAjax();

   const currentInput = getValue('currentInput');
   const customPrompt = getValue('customPrompt');
   const jobDescription = getValue('jobDescription');
   const aiThread = getValue('aiThread');

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
   }, []);

   const generateSummary = () => {
      const payload = { currentInput, customPrompt, jobDescription, aiThread };

      emit('generate-summary', payload, (response) => {
         const { error, message } = response as { error: boolean; message: string };
         const { summary, aiThread } = response as { summary: string; aiThread: string };

         if (error) {
            console.error('Error generating CV summary:', message);
            setResponseError({ message });
            return;
         }

         setFieldValue('customPrompt', '');
         setFieldValue('currentInput', summary);
         setFieldValue('aiThread', aiThread);
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

         <LoadingModal isOpen={Boolean(generateStatus)} message={generateStatus} />
      </Card>
   );
}
