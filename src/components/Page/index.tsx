'use client';

import React from 'react';
import Header from '../Header';
import Chat from '../Chat';
import { useSelector } from 'react-redux';
import { ChatState } from '@/store/store.types';

const Page: React.FC = () => {
   const chatState = useSelector((state: { chat: ChatState }) => state?.chat?.chatState);

   return (
      <main>
         <Header />
         {chatState && <Chat />}
      </main>
   )
}

export default Page;
