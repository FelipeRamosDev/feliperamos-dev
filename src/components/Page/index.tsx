'use client';

import React from 'react';
import Header from '@/components/headers/Header';
import Chat from '@/components/Chat';
import { useSelector, useDispatch } from 'react-redux';
import { ChatState } from '@/store/store.types';
import { chatSliceActions } from '@/store';
import CTAButton from '@/components/buttons/CTAButton';
import { useSocket } from '@/services/SocketClient';

const Page: React.FC = () => {
   const dispatch = useDispatch();
   const setChatState = () => dispatch(chatSliceActions.toggleChat());
   const chatState = useSelector((state: { chat: ChatState }) => state?.chat?.chatState);
   const { socket } = useSocket();

   const setBotMessage = (message: string, timestamp: number) => {
      dispatch(chatSliceActions.setMessage({ timestamp, message, self: false }));
   }

   const handleStartChat = () => {
      if (!socket) {
         return;
      }

      socket.emit('start-chat', { message: 'Chat started' }, (response: any) => {
         if (response.error) {
            console.error(response.message);
            return;
         }

         console.log('Server response:', response);
         if (response.success) {
            setChatState();
         }
      });

      socket.on('bot-message', (data: any) => {
         setBotMessage(data.message, data.timestamp);
      });
   };

   return (
      <main>
         <Header />
         {chatState && <Chat />}

         {!chatState && <div className="button-wrap">
            <CTAButton onClick={handleStartChat}>Start Chat</CTAButton>
         </div>}
      </main>
   )
}

export default Page;
