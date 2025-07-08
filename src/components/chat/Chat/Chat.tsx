'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatState } from '@/store/store.types';
import { chatSliceActions } from '@/store';
import Message from '@/models/Message';

// Components
import { ChatForm, ChatMessage, ChatHeader } from '..';
import { Card } from '@/components/common';
import { CTAButton } from '@/components/buttons';
import { useSocket } from '@/services/SocketClient';

// Scripts
import { handleStartChat, handleScroll } from '@/components/chat/Chat/Chat.script';

// Types
import type { ChatProps } from './Chat.types';
import { parseCSS } from '@/utils/parse';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import chatText from './Chat.text';

export default function Chat({ className, footerMode }: ChatProps) {
   const dispatch = useDispatch();
   const { socket, emit, connect } = useSocket();
   const { textResources } = useTextResources(chatText);
   const historyElm = useRef<HTMLDivElement>(null);
   const chatCard = useRef<HTMLDivElement>(null);

   // States
   const history = useSelector((state: { chat: ChatState }) => state.chat.history);
   const assistantTyping = useSelector((state: { chat: ChatState }) => state.chat.assistantTyping);
   const chatState = useSelector((state: { chat: ChatState }) => state?.chat?.chatState);
   const [loading, setLoading] = useState<boolean>(false);

   // Setters
   const setChatState = () => dispatch(chatSliceActions.toggleChat());
   const setThreadID = (id: string | null) => dispatch(chatSliceActions.setThreadID(id));
   const setAssistantTyping = (status: boolean) => dispatch(chatSliceActions.setAssistantTyping(status));
   const classNames = parseCSS(className, ['Chat', !chatState ? 'closed' : '']);

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
      const scrollListener = () => handleScroll(chatCard);

      window.removeEventListener('scroll', scrollListener);
      window.addEventListener('scroll', scrollListener);

      // Cleanup event listener
      return () => {
         window.removeEventListener('scroll', scrollListener);
      };
   }, []);

   useEffect(() => {
      historyElm.current?.scrollTo({ top: historyElm.current.scrollHeight });
   }, [history.length, assistantTyping]);

   return (
      <Card
         ref={chatCard}
         className={classNames}
         noElevation
         noRadius
         noPadding
      >
         <ChatHeader />

         <Card
            ref={historyElm}
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

            {!footerMode && history.map((message: Message, i: number) => message.timestamp && (
               <ChatMessage key={message.timestamp + i} index={i} message={message} />
            ))}

            {assistantTyping && (
               <ChatMessage
                  key="assistant-typing"
                  message={{
                     content: textResources.getText('Chat.assistantTyping'),
                     from: 'assistant'
                  }}
               />
            )}
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
