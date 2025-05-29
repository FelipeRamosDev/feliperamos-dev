import { parseCSS } from '@/helpers';
import React, { FormEvent } from 'react';
import { ChatFormProps } from '../Chat.types';
import ChatInput from '../ChatInput';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatForm: React.FC<ChatFormProps> = ({ chat, dispatch, className }) => {
   const setInput = (value: string) => dispatch({ type: 'SET_INPUT', value });
   const setMessage = () => dispatch({ type: 'SET_MESSAGE', value: '' });

   const handleSend = (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      setMessage();
   }

   return (
      <form className={parseCSS(className, 'chat-form')} onSubmit={handleSend}>
         <ChatInput value={chat.inputValue} setInput={setInput} setMessage={setMessage} />

         <div className="button-wrap">
            <IconButton type="submit" color="primary" size="large">
               <SendIcon />
            </IconButton>
         </div>
      </form>
   );
};

export default ChatForm;
