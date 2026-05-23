import { SocketErrorCallback, useSocket } from '@/services/SocketClient';
import { LetterData } from '@/types/database.types';
import { useCallback, useState } from 'react';
import { useChatManager } from '@/contexts';

import type {
   GenerateLetterContext,
   GenerateLetterParams,
   GenerateLetterResponse,
   GenerateLetterStatus
} from './useGenLetter.types';

export default function useGenLetter(): GenerateLetterContext {
   const [ initLetter, setInitLetter ] = useState<Partial<LetterData> | null>(null);
   const { isConnected, connect, emit, socket } = useSocket();
   const [ generateStatus, setGenerateStatus ] = useState<GenerateLetterStatus>('starting');
   const { setChat } = useChatManager();

   const connectToSocket = useCallback(async () => {
      try {
         await connect();

         emit('start-letter', { label: 'resume' }, (response) => {
            const { error, message } = response as SocketErrorCallback;
            const { chatId, roomId } = response as { chatId: string, roomId: string };

            if (error) {
               setGenerateStatus('error');
               console.error(`Error starting letter generation: ${message}`);
               return;
            }

            setChat({ chatId, roomId });
         });
      } catch (error) {
         console.error('Error connecting to socket:', error);
      }
   }, [connect, setChat]);

   const generateLetter = useCallback((
      params: GenerateLetterParams,
      callback: (response: GenerateLetterResponse) => void = () => {}
   ) => {
      setInitLetter(null);

      emit('generate-letter', params, (response) => {
         const { error, message } = response as SocketErrorCallback;
         const { letterSubject, letterBody } = response as GenerateLetterResponse;

         if (error) {
            setGenerateStatus('error');
            console.error(`Error generating letter: ${message}`);
            return;
         }

         setGenerateStatus('success');
         setInitLetter({
            subject: letterSubject,
            body: letterBody,
         });

         callback({ letterSubject, letterBody });
      });
   }, [emit]);

   const addStatusListener = useCallback(() => {
      if (!socket) return;

      socket.on('letter:generate-letter:status', (status) => {
         setGenerateStatus(status as GenerateLetterStatus);
      });
   }, [socket]);

   return {
      initLetter,
      isConnected,
      generateStatus,
      connect: connectToSocket,
      generateLetter,
      setInitLetter,
      setGenerateStatus,
      addStatusListener
   };
}
