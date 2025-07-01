'use client';

import React from 'react';
import Header from '@/components/headers/Header';
import Chat from '@/components/Chat';
import { useSelector, useDispatch } from 'react-redux';
import { ChatState } from '@/store/store.types';
import { chatSliceActions } from '@/store';
import CTAButton from '@/components/buttons/CTAButton';
import { useSocket } from '@/services/SocketClient';
import Message from '@/models/Message';

const Page: React.FC = () => {
   const dispatch = useDispatch();
   const setChatState = () => dispatch(chatSliceActions.toggleChat());
   const setThreadID = (id: string | null) => dispatch(chatSliceActions.setThreadID(id));
   const setAssistantTyping = (status: boolean) => dispatch(chatSliceActions.setAssistantTyping(status));
   const chatState = useSelector((state: { chat: ChatState }) => state?.chat?.chatState);
   const { socket, emit } = useSocket();

   const setBotMessage = (data: { content: string; timestamp: number }) => {
      const { content, timestamp } = data || {};
      const message = new Message({ content, timestamp, from: 'assistant' });
      const serialized = message.serialize();

      dispatch(chatSliceActions.setMessage(serialized));
   }

   const handleStartChat = () => {
      if (!socket && !chatState) {
         return;
      }

      emit('start-chat', null, (response: any) => {
         if (response.error) {
            console.error(response.message);
            return;
         }

         if (!response.success) {
            console.error('Something went wrong while starting the chat:', response);
            return;
         }
         
         setChatState();
         socket?.on('assistant-message', (data: any) => {
            if (!data) {
               console.error('Received invalid assistant message:', data);
               setBotMessage({ content: 'Something went wrong. No response from the assistant', timestamp: Date.now() });
               return;
            }
   
            if (data.error) {
               console.error('Error from assistant:', data.message || data);
               setBotMessage({ content: 'Something went wrong. Please try again later.', timestamp: Date.now() });
               return;
            }
   
            if (data.success && data.content) {
               setThreadID(data.threadID);
               setBotMessage(data);
            }
         });

         socket?.on('assistant-typing', (typingStatus: any) => {
            setAssistantTyping(typingStatus);
         });
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
