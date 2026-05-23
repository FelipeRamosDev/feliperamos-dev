import { useEffect, useRef } from 'react';
import { ModalBase, Spinner } from '@/components/common';
import { BuildCoverLetterForm } from '@/components/forms/cover-letter';
import { BuildCoverLetterModalProps } from './BuildCoverLetterModal.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import statusFeedback from '@/resources/text/feedback.text';
import { useGenLetterContext } from '@/hooks/useGenLetter/GenLetterContext';
import { useChatManager } from '@/contexts';

export default function BuildCoverLetterModal({ isOpen = false, onClose, opportunityId, companyId }: BuildCoverLetterModalProps) {
   const { initLetter, generateStatus, isConnected, setInitLetter, generateLetter, connect, addStatusListener } = useGenLetterContext();
   const { textResources } = useTextResources(statusFeedback);
   const isGenerated = useRef<boolean>(false);
   const { chat } = useChatManager();

   useEffect(() => {
      if (!isConnected && isOpen) {
         connect().then(() => {
            addStatusListener();
         }).catch(err => {
            console.error('Socket connection error:', err);
         });

         return;
      }
      
      if (isConnected && isOpen && !isGenerated.current && chat?.roomId) {
         isGenerated.current = true;
         generateLetter({ opportunityId, roomId: chat?.roomId, agentId: 'letter-gen' });
      }
   }, [isConnected, isOpen, opportunityId, generateLetter, connect, addStatusListener, chat?.roomId]);

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
