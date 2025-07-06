'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatState } from '@/store/store.types';
import { chatSliceActions } from '@/store';
import Message from '@/models/Message';

// Components
import { ChatForm, ChatMessage, ChatHeader } from '..';
import { Card } from '@/components/common';
import { CTAButton } from '@/components/common/buttons';
import { useSocket } from '@/services/SocketClient';

// Scripts
import { handleStartChat } from '@/components/chat/Chat/Chat.script';

// Types
import type { ChatProps } from './Chat.types';
import { parseCSS } from '@/utils/parse';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import chatText from './Chat.text';

export default function Chat({ className }: ChatProps ) {
   const dispatch = useDispatch();
   const elm = useRef<HTMLDivElement>(null);
   const { socket, emit, connect } = useSocket();
   const { textResources } = useTextResources(chatText);

   // States
   const history = useSelector((state: { chat: ChatState }) => state.chat.history);
   const assistantTyping = useSelector((state: { chat: ChatState }) => state.chat.assistantTyping);
   const chatState = useSelector((state: { chat: ChatState }) => state?.chat?.chatState);
   const [ loading, setLoading ] = useState<boolean>(false);

   // Setters
   const setChatState = () => dispatch(chatSliceActions.toggleChat());
   const setThreadID = (id: string | null) => dispatch(chatSliceActions.setThreadID(id));
   const setAssistantTyping = (status: boolean) => dispatch(chatSliceActions.setAssistantTyping(status));
   
   const WELCOME_MESSAGE = [
      textResources.getText('Chat.welcome1'),
      textResources.getText('Chat.welcome2'),
      textResources.getText('Chat.welcome3')
   ];


   const startChat = () => handleStartChat(
      socket,
      chatState,
      emit,
      connect,
      dispatch,
      setChatState,
      setThreadID,
      setAssistantTyping,
      setLoading
   );

   useEffect(() => {
      elm.current?.scrollTo({ top: elm.current.scrollHeight });
   }, [ history.length, assistantTyping ]);

   return (
      <Card className={parseCSS(className, ['Chat', !chatState ? 'closed' : ''])} noElevation noRadius noPadding>
         <ChatHeader />

         <Card
            ref={elm}
            padding="s"
            className="history"
            noElevation
         >
            {WELCOME_MESSAGE.map((content, index) => (
               <ChatMessage
                  index={index}
                  key={`initial-welcome-${index + 1}`}
                  message={{ from: 'assistant', content }}
               />
            ))}

            {history.map((message: Message, i: number) => message.timestamp && (
               <ChatMessage key={message.timestamp + i} index={i} message={message} />
            ))}

            {assistantTyping && <ChatMessage key="assistant-typing" message={{ content: textResources.getText('Chat.assistantTyping'), from: 'assistant' }} />}
         </Card>

         {chatState ? (
            <ChatForm />
         ) : (
            <div className="button-wrap">
               <CTAButton
                  fullWidth
                  color="primary"
                  loading={loading}
                  onClick={startChat}
               >{textResources.getText('Chat.button.startChat')}</CTAButton>
            </div>
         )}
      </Card>
   );
};
