import React, { useRef } from 'react';
import { ChatInputProps } from '../Chat.types';
import TextField from '@mui/material/TextField';
import { parseCSS } from '@/helpers';

const ChatInput: React.FC<ChatInputProps> = ({ setInput, setMessage, value = '', className }) => {
   const toSend = useRef<boolean>(false);
   const handleInput = (ev: any): void => {
      const input: string = ev.target.value;

      if (!toSend.current) {
         return setInput(input);
      }

      setMessage();
   }

   const handleKeyDown = (ev: any): void => {
      toSend.current = Boolean(ev.shiftKey && ev.key === 'Enter');
   }

   return <TextField
      className={parseCSS(className, 'chat-input')}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      variant="filled"
      value={value}
      hiddenLabel
      multiline
      fullWidth
   />;
};

export default ChatInput;
