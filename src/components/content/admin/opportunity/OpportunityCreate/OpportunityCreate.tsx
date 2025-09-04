'use client';

import { Container } from '@/components/common';
import { BuildOpportunityForm } from '@/components/forms/opportunities';
import { PageHeader } from '@/components/headers';
import { useSocket } from '@/services/SocketClient';
import { useEffect, useRef, useState } from 'react';

export default function OpportunityCreate() {
   const [connecting, setConnecting] = useState<boolean>(false);
   const { connect, socket } = useSocket();
   const attempted = useRef<boolean>(false);

   useEffect(() => {
      if (connecting || attempted.current) return;

      attempted.current = true;
      setConnecting(true);

      connect().then(() => {
         socket?.on('opportunities:scrap-linkedin-job:status', (status) => {
            console.log('LinkedIn Job Scrap Status:', status);
         });
      }).catch(err => {
         console.error('Socket connection error:', err);
      }).finally(() => {
         setConnecting(false);
      });
   }, [connect, connecting, socket]);

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
