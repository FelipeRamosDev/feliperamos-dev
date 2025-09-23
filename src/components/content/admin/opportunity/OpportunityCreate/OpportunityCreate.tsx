'use client';

import { Container } from '@/components/common';
import { BuildOpportunityForm } from '@/components/forms/opportunities';
import { PageHeader } from '@/components/headers';
import { useGenLetter } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

export default function OpportunityCreate() {
   const [connecting, setConnecting] = useState<boolean>(false);
   const { connect } = useGenLetter();
   const attempted = useRef<boolean>(false);

   useEffect(() => {
      if (connecting || attempted.current) return;

      attempted.current = true;
      setConnecting(true);

      connect().catch(err => {
         console.error('Socket connection error:', err);
      }).finally(() => {
         setConnecting(false);
      });
   }, [ connecting, connect ]);

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
