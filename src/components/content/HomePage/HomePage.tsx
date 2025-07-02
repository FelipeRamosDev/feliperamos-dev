'use client';

import React from 'react';
import { Header } from '@/components/headers';
import { Chat } from '@/components/chat';
import { useSelector, useDispatch } from 'react-redux';
import { ChatState } from '@/store/store.types';
import { chatSliceActions } from '@/store';
import { CTAButton } from '@/components/common/buttons';
import { useSocket } from '@/services/SocketClient';
import Message from '@/models/Message';

const HomePage: React.FC = () => {
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
      if (!socket || chatState) {
         return;
      }

      emit('start-chat', null, (response: unknown) => {
         const chatResponse = response as { error?: boolean; message?: string; success?: boolean; };
         if (chatResponse.error) {
            console.error(chatResponse.message);
            return;
         }

         if (!chatResponse.success) {
            console.error('Something went wrong while starting the chat:', chatResponse);
            return;
         }
         
         setChatState();
         socket?.on('assistant-message', (data: unknown) => {
            const assistantData = data as { 
               content?: string; 
               timestamp?: number; 
               error?: boolean; 
               message?: string; 
               success?: boolean; 
               threadID?: string 
            } | null;
            
            if (!assistantData) {
               console.error('Received invalid assistant message:', data);
               setBotMessage({ content: 'Something went wrong. No response from the assistant', timestamp: Date.now() });
               return;
            }
   
            if (assistantData.error) {
               console.error('Error from assistant:', assistantData.message || assistantData);
               setBotMessage({ content: 'Something went wrong. Please try again later.', timestamp: Date.now() });
               return;
            }
   
            if (assistantData.success && assistantData.content) {
               setThreadID(assistantData.threadID || null);
               setBotMessage(assistantData as { content: string; timestamp: number });
            }
         });

         socket?.on('assistant-typing', (typingStatus: unknown) => {
            setAssistantTyping(typingStatus as boolean);
         });
      });
   };

   return (
      <div className="HomePage">
         {chatState && <Chat />}

         {!chatState && <div className="button-wrap">
            <CTAButton onClick={handleStartChat}>Start Chat</CTAButton>
         </div>}
      </div>
   )
}

export default HomePage;
