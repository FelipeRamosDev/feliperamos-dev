import Message from '@/models/Message';
import { SocketClient } from '@/services/SocketClient';
import { SocketEmitEvent } from '@/services/SocketClient/SocketClient.types';
import { chatSliceActions } from '@/store';
import { Dispatch, UnknownAction } from 'redux';

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
   dispatch: Dispatch,
   setChatState: () => void,
   setThreadID: (id: string | null) => void,
   setAssistantTyping: (status: boolean) => void
) => {
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
};
