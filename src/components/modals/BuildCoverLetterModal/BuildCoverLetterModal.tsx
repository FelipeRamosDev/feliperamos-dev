import { useEffect, useState, useCallback } from 'react';
import { ModalBase, Spinner } from '@/components/common';
import { BuildCoverLetterForm } from '@/components/forms/cover-letter';
import { BuildCoverLetterModalProps, BuildCoverLetterResponse, GenerateCoverLetterStatus } from './BuildCoverLetterModal.types';
import { useSocket } from '@/services/SocketClient';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import statusFeedback from '@/resources/text/feedback.text';
import { LetterData } from '@/types/database.types';

export default function BuildCoverLetterModal({ isOpen = false, onClose, opportunityId, companyId }: BuildCoverLetterModalProps) {
   const [ initLetter, setInitLetter ] = useState<Partial<LetterData> | null>(null);
   const { isConnected, emit } = useSocket();
   const [ generateStatus, setGenerateStatus ] = useState<GenerateCoverLetterStatus>('starting');
   const { textResources } = useTextResources(statusFeedback);

   const generateCoverLetter = useCallback(async () => {
      setInitLetter(null);

      try {
         emit('generate-letter', { opportunityId }, (response) => {
            const { letterSubject, letterBody } = response as BuildCoverLetterResponse;

            setGenerateStatus('success');
            setInitLetter({
               subject: letterSubject,
               body: letterBody,
            });
         });
      } catch (error) {
         console.error('Error generating cover letter:', error);
         setGenerateStatus('error');
      }
   }, [emit, opportunityId]);

   useEffect(() => {
      if (isConnected && isOpen) {
         generateCoverLetter();
      }
   }, [generateCoverLetter, isConnected, isOpen]);

   return (
      <ModalBase
         isOpen={isOpen}
         onClose={onClose}
         title="Edit Cover Letter"
      >
         {generateStatus !== 'success' ? (
            <Spinner message={textResources.getText('coverLetter.feedback', generateStatus)} />
         ) : (
            initLetter && (
               <BuildCoverLetterForm
                  initialValues={initLetter}
                  opportunityId={opportunityId}
                  companyId={companyId}
                  onSuccess={() => {
                     onClose();
                     setInitLetter(null);
                  }}
               />
            )
         )}
      </ModalBase>
   );
}
