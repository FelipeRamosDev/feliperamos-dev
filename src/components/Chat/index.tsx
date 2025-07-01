import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ChatState } from '@/store/store.types';
import { parseCSS } from '@/helpers';
import Card from '@/components/Card';
import Message from '@/models/Message';
import { ChatProps } from './Chat.types';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';


const Chat: React.FC<ChatProps> = ({ className }) => {
   const history = useSelector((state: { chat: ChatState}) => state.chat.history);
   const elm = useRef<HTMLDivElement>(null);

   useEffect(() => {
      elm.current?.scrollTo({ top: elm.current.scrollHeight });
   }, [history.length]);

   return (
      <Card className={parseCSS(className, 'chat')} noElevation noRadius>
         <Card
            ref={elm}
            padding="s"
            className="history"
            noElevation
         >
            {history.map((message: Message, i: number) => <ChatMessage key={message.timestamp + i} index={i} message={message} />)}
         </Card>

         <ChatForm />
      </Card>
   );
};

export default Chat;
