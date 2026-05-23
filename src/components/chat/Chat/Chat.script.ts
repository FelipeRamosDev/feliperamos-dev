import Message from '@/models/Message';
import { SocketEmitEvent } from '@/services/SocketClient/SocketClient.types';
import { chatSliceActions } from '@/store';
import { Dispatch, UnknownAction } from 'redux';
import type { SocketClient } from '@/services/SocketClient';

export const setBotMessage = (
   dispatch: Dispatch<UnknownAction>,
   data: { content: string; timestamp: number; messageId?: string }
) => {
   const { content, timestamp, messageId } = data || {};
   const message = new Message({ content, timestamp, from: 'assistant', messageId });
   const serialized = message.serialize();

   dispatch(chatSliceActions.setMessage(serialized));
   return message;
}

export const handleStartChat = (
   socket: SocketClient | null,
   chatState: boolean,
   emit: SocketEmitEvent,
   connect: () => Promise<void | SocketClient>,
   dispatch: Dispatch,
   setChatState: () => void,
   setThreadID: (id: string | null) => void,
   setLoading: (loading: boolean) => void
) => {
   if (!socket || chatState) {
      return;
   }

   setLoading(true);
   connect().then(() => {
      emit('start-chat', { label: 'resume' }, (response: unknown) => {
         const chatResponse = response as { error?: boolean; message?: string; success?: boolean; roomId?: string,  };
         if (chatResponse.error) {
            console.error(chatResponse.message);
            return;
         }

         if (!chatResponse.success) {
            console.error('Something went wrong while starting the chat:', chatResponse);
            return;
         }

         setChatState();
         setThreadID(chatResponse.roomId || null);

         socket.on('message_chunk', (data: unknown) => {
            const { chunk, messageId } = data as { chunk: string; messageId?: string };
            setBotMessage(dispatch, { content: chunk, timestamp: Date.now(), messageId });
         });

         socket.on('message_end', (data: unknown) => {
            const { finalOutput, messageId } = data as { finalOutput: string, messageId?: string };
            setBotMessage(dispatch, { content: finalOutput, timestamp: Date.now(), messageId });
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
