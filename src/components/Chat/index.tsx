import React, { useEffect, useRef } from 'react';
import { parseCSS } from '@/helpers';
import Card from '@/components/Card';
import { ChatProps } from './Chat.types';
import Message from '@/models/Message';
import ChatForm from './ChatForm';
import ChatMessage from './ChatMessage';
import { useSelector } from 'react-redux';
import { ChatState } from '@/store/store.types';


const Chat: React.FC<ChatProps> = ({ className }) => {
   const elm = useRef<HTMLDivElement>(null);
   const history = useSelector((state: { chat: ChatState}) => state.chat.history);

   useEffect(() => {
      elm.current?.scrollTo({ top: elm.current.scrollHeight });
   }, [history.length]);

   return (
      <Card className={parseCSS(className, 'chat card')} noElevation>
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
