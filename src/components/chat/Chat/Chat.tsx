import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ChatState } from '@/store/store.types';
import { parseCSS } from '@/helpers';
import { Card } from '@/components/common';
import Message from '@/models/Message';
import { ChatProps } from './Chat.types';
import { ChatForm, ChatMessage } from '..';


const Chat: React.FC<ChatProps> = ({ className }) => {
   const history = useSelector((state: { chat: ChatState}) => state.chat.history);
   const assistantTyping = useSelector((state: { chat: ChatState }) => state.chat.assistantTyping);
   const elm = useRef<HTMLDivElement>(null);

   useEffect(() => {
      elm.current?.scrollTo({ top: elm.current.scrollHeight });
   }, [history.length, assistantTyping]);

   return (
      <Card className={parseCSS(className, 'chat')} noElevation noRadius>
         <Card
            ref={elm}
            padding="s"
            className="history"
            noElevation
         >
            {history.map((message: Message, i: number) => message.timestamp && <ChatMessage key={message.timestamp + i} index={i} message={message} />)}
            {assistantTyping && <ChatMessage key="assistant-typing" message={{ content: 'Assistant is typing...', from: 'assistant' }} />}
         </Card>

         <ChatForm />
      </Card>
   );
};

export default Chat;
