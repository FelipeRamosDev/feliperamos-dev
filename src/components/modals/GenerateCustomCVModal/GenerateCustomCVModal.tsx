import { ModalBase, Spinner } from '@/components/common';
import { GenerateCustomCVModalProps, GenerateSummaryError, GenerateSummarySuccess, LoadStatusOptions } from './GenerateCustomCVModal.types';
import GenerateCustomCVForm from '@/components/forms/curriculums/GenerateCustomCVForm/GenerateCustomCVForm';
import { GenerateSummaryParams } from '@/components/widgets/CustomCVWidget/CustomCVWidget.types';
import { useSocket } from '@/services/SocketClient';
import { useEffect, useRef, useState } from 'react';
import { DocumentScanner } from '@mui/icons-material';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from './GenerateCustomCVModal.module.scss';

function parseLoadStatus(status: LoadStatusOptions) {
   switch (status) {
      case 'started':
         return 'Generating your CV...';
      case 'connecting':
         return 'Connecting to the server...';
      case 'fetching-url':
         return 'Fetching job description from LinkedIn...';
      case 'generating-summary':
         return 'Generating CV summary...';
      case 'success':
         return 'CV generated successfully!';
      case 'error':
         return 'Error generating CV.';
      default:
         return 'Unknown status.';
   }
}

export default function GenerateCustomCVModal({ className, genSummaryParams, isOpen, onClose }: GenerateCustomCVModalProps): React.JSX.Element {
   const { connect, disconnect, emit, socket } = useSocket();
   const [loadStatus, setLoadStatus] = useState<LoadStatusOptions>('started');
   const [genParams, setGenParams] = useState<GenerateSummaryParams | null>(genSummaryParams);
   const isInit = useRef(false);
   const isLoading = (loadStatus !== 'success' && loadStatus !== 'error');

   const generateSummary = async (data?: GenerateSummaryParams) => {
      emit('generate-summary', { ...genParams, ...data }, (response: unknown) => {
         const { error, summary, jobDescription, aiThread } = response as GenerateSummarySuccess & GenerateSummaryError;

         if (error) {
            console.error('Error generating summary:', error);
            setLoadStatus('error');
            return;
         }

         setGenParams((prev) => ({
            ...prev,
            currentInput: summary || null,
            jobDescription: jobDescription || null,
            aiThread: aiThread || null
         } as GenerateSummaryParams));
      });

      return { success: true };
   };

   useEffect(() => {
      if (isInit.current || !socket) {
         return;
      }

      isInit.current = true;
      setLoadStatus('connecting');
      connect().then(() => {
         socket?.on('custom-cv:status', (status: unknown) => {
            setLoadStatus(status as LoadStatusOptions);
         });

         generateSummary();
      }).catch(() => {
         setLoadStatus('error');
      });
   }, [socket, connect, generateSummary]);

   return (
      <ModalBase
         title="Generate Custom CV"
         icon={<DocumentScanner />}
         className={parseCSS(className, styles.GenerateCustomCVModal)}
         isOpen={isOpen}
         onClose={onClose}
         onDestroy={disconnect}
      >
         {isLoading && (
            <div className={styles.loadingWrap}>
               <Spinner size="large" />
               <p>{parseLoadStatus(loadStatus)}</p>
            </div>
         )}

         {(genParams?.currentInput) && (loadStatus === 'success') && (
            <GenerateCustomCVForm
               viewType="full"
               onSubmit={generateSummary}
               initialValues={{ ...genParams }}
            />
         )}
      </ModalBase>
   );
}
