import React from 'react';
import Card from '@/components/Card';
import { ChatMessageProps } from '../Chat.types';

const ChatMessage: React.FC<ChatMessageProps> = ({ message, ...props }) => {
   const isSelfClass: string = message.self ? 'is-self' : '';

   return (
      <Card
         className={[ 'chat-message', isSelfClass ]}
         noPadding
         noElevation
         {...props}
      >
         <div className="message-container">
            <div className="content">
               {message.content}
            </div>

            <div className="message-date">
               <small className="date">{message.dateString}</small>{' - '}
               <small className="time">{message.timeString}</small>
            </div>
         </div>
      </Card>
   );
}

export default ChatMessage;
