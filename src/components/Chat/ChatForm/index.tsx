import { parseCSS } from '@/helpers';
import React, { FormEvent } from 'react';
import { ChatFormProps } from '../Chat.types';
import ChatInput from '../ChatInput';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { chatSliceActions } from '@/store';
import { useDispatch } from 'react-redux';

const ChatForm: React.FC<ChatFormProps> = ({ className }) => {
   const dispatch = useDispatch();
   const setMessage = () => {
      dispatch(chatSliceActions.setMessage());
   };

   const handleSend = (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      setMessage();
   }

   return (
      <form className={parseCSS(className, 'chat-form')} onSubmit={handleSend}>
         <ChatInput />

         <div className="button-wrap">
            <IconButton
               className="icon-button"
               type="submit"
               color="primary"
               size="large"
               title="Send Message"
            >
               <SendIcon />
            </IconButton>
         </div>
      </form>
   );
};

export default ChatForm;
