'use client';

import React, { useState } from 'react';
import Header from '../Header';
import Chat from '../Chat';

const Page: React.FC = () => {
  const [ chatState, setChatState ] = useState<boolean>(false);

   return (
      <main>
         <Header chatState={chatState} setChatState={setChatState} />
         {chatState && <Chat />}
      </main>
   )
}

export default Page;
