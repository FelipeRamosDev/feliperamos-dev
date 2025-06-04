'use client';

import React from 'react';
import Header from '@/components/headers/Header';
import Chat from '@/components/Chat';
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
