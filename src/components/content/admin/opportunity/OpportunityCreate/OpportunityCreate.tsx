'use client';

import { Container } from '@/components/common';
import { BuildOpportunityForm } from '@/components/forms/opportunities';
import { PageHeader } from '@/components/headers';
import { useSocket } from '../../../../../services/SocketClient';
import { useEffect, useRef, useState } from 'react';
import { useChatManager } from '@/contexts';

export default function OpportunityCreate() {
   const [connecting, setConnecting] = useState<boolean>(false);
   const { connect, emit } = useSocket();
   const attempted = useRef<boolean>(false);
   const { setChat } = useChatManager();

   useEffect(() => {
      if (connecting || attempted.current) return;

      attempted.current = true;
      setConnecting(true);

      connect().then(() => {
         emit('start-build', { label: 'resume', chatName: 'Custom CV Build' }, (response: unknown) => {
            const res = response as { chatId: string; roomId: string };
            setChat({ chatId: res.chatId, roomId: res.roomId })
         });
      }).catch(err => {
         console.error('Socket connection error:', err);
      }).finally(() => {
         setConnecting(false);
      });
   }, [connecting, connect, emit, setChat]);

   return (
      <div className="OpportunityCreate">
         <PageHeader
            title="Create Opportunity"
            description="Fill in the details to create a new opportunity."
         />

         <Container fullwidth>
            <BuildOpportunityForm />
         </Container>
      </div>
   );
}
