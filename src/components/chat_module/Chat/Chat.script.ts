import Message from '@/models/Message';
import { SocketEmitEvent } from '@/services/SocketClient/SocketClient.types';
import { chatSliceActions } from '@/store';
import { Dispatch, UnknownAction } from 'redux';
import type { SocketClient } from '@/services/SocketClient';

export const setBotMessage = (
   dispatch: Dispatch<UnknownAction>,
   data: { content: string; timestamp: number }
) => {
   const { content, timestamp } = data || {};
   const message = new Message({ content, timestamp, from: 'assistant' });
   const serialized = message.serialize();

   dispatch(chatSliceActions.setMessage(serialized));
}

export const handleStartChat = (
   socket: SocketClient | null,
   chatState: boolean,
   emit: SocketEmitEvent,
   connect: () => Promise<void>,
   dispatch: Dispatch,
   setChatState: () => void,
   setThreadID: (id: string | null) => void,
   setAssistantTyping: (status: boolean) => void,
   setLoading: (loading: boolean) => void
) => {
   if (!socket || chatState) {
      return;
   }

   setLoading(true);
   connect().then(() => {
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
               setBotMessage(dispatch, { content: 'Something went wrong. No response from the assistant', timestamp: Date.now() });
               return;
            }

            if (assistantData.error) {
               console.error('Error from assistant:', assistantData.message || assistantData);
               setBotMessage(dispatch, { content: 'Something went wrong. Please try again later.', timestamp: Date.now() });
               return;
            }

            if (assistantData.success && assistantData.content) {
               setThreadID(assistantData.threadID || null);
               setBotMessage(dispatch, assistantData as { content: string; timestamp: number });
            }
         });

         socket?.on('assistant-typing', (typingStatus: unknown) => {
            setAssistantTyping(typingStatus as boolean);
         });
      });
   }).catch((error: unknown) => {
      console.error('Error connecting to the chat server:', error);
      setBotMessage(dispatch, { content: 'Failed to connect to the chat server. Please try again later.', timestamp: Date.now() });
   }).finally(() => setLoading(false));
};

export function handleScroll(chatCard: React.RefObject<HTMLDivElement | null>) {
   const currentPosition = window.scrollY;
   const windowHeight = window.innerHeight;
   const documentHeight = document.documentElement.scrollHeight;

   if (!chatCard?.current || window.innerWidth > 768) {
      return;
   }

   if (currentPosition > 15) {
      chatCard.current?.classList.add('scrolled');
   } else {
      chatCard.current?.classList.remove('scrolled');
   }

   // Check if scroll hit the end (within 10px threshold)
   if (currentPosition + windowHeight >= documentHeight - 15) {
      chatCard.current?.classList.add('scrolled-end');
   } else {
      chatCard.current?.classList.remove('scrolled-end');
   }
}
