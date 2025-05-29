import React from 'react';
import { ChatMessageProps } from '../Chat.types';
import Card from '@/components/Card';

const ChatMessage: React.FC<ChatMessageProps> = ({ message, ...props }) => {
   return (
      <Card className={[ 'chat-message', message.self ? 'is-self' : '' ]} noPadding noElevation {...props}>
         <pre className="message-container">
            {message.content}
         </pre>
      </Card>
   );
}

export default ChatMessage;
