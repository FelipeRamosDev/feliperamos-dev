import { useEffect } from 'react';
import { ModalBase, Spinner } from '@/components/common';
import { BuildCoverLetterForm } from '@/components/forms/cover-letter';
import { BuildCoverLetterModalProps } from './BuildCoverLetterModal.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import statusFeedback from '@/resources/text/feedback.text';
import { useGenLetter } from '@/hooks';

export default function BuildCoverLetterModal({ isOpen = false, onClose, opportunityId, companyId }: BuildCoverLetterModalProps) {
   const { initLetter, generateStatus, isConnected, setInitLetter, generateLetter, connect, addStatusListener } = useGenLetter();
   const { textResources } = useTextResources(statusFeedback);

   useEffect(() => {
      if (!isConnected && isOpen) {
         connect().then(() => {
            addStatusListener();
         }).catch(err => {
            console.error('Socket connection error:', err);
         });
      }
      
      if (isConnected && isOpen) {
         generateLetter({ opportunityId });
      }
   }, [generateLetter, isConnected, isOpen, opportunityId, connect, addStatusListener]);

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
