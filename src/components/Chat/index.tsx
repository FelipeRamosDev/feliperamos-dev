import React, { useEffect, useReducer, useRef } from 'react';
import { parseCSS } from '@/helpers';
import Card from '@/components/Card';
import { ChatProps, ChatState } from './Chat.types';
import { chatReducer } from './Chat.scripts';
import Message from '@/models/Message';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';

const INITAL_STATE: ChatState = {
   history: [],
   inputValue: ''
}

const Chat: React.FC<ChatProps> = ({ className }) => {
   const [ chat, dispatch ] = useReducer(chatReducer, INITAL_STATE);
   const elm = useRef<HTMLDivElement>(null);

   useEffect(() => {
      elm.current?.scrollTo({ top: elm.current.scrollHeight });
   }, [chat.history.length]);

   return (
      <Card className={parseCSS(className, 'chat card')} noElevation>
         <Card
            ref={elm}
            padding="s"
            className="history"
            noElevation
         >
            {chat.history.map((message: Message, i: number) => <ChatMessage key={message.timestamp + i} message={message} />)}
         </Card>

         <ChatForm chat={chat} dispatch={dispatch} />
      </Card>
   );
};

export default Chat;
