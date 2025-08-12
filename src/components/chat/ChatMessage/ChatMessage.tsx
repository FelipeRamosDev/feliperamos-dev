import React from 'react';
import Card from '@/components/common/Card/Card';
import { ChatMessageProps } from '../Chat/Chat.types';
import { Markdown } from '@/components/common';

const ChatMessage: React.FC<ChatMessageProps> = ({ index, message, ...props }) => {
   const isSelfClass: string = message.self ? 'is-self' : '';

   if (!message.content) {
      return <></>;
   }

   return (
      <Card
         className={[ 'chat-message', isSelfClass ]}
         noPadding
         noElevation
         testId={`chat-message-${index}`}
         {...props}
      >
         <div className="message-container">
            <Markdown className="content" value={message.content} />

            {message.timestamp &&<div className="message-date">
               <small className="date" data-testid={`message-date-${index}`}>{message.dateString}</small>{' - '}
               <small className="time" data-testid={`message-time-${index}`}>{message.timeString}</small>
            </div>}
         </div>
      </Card>
   );
}

export default ChatMessage;
