import React, { useRef } from 'react';
import { ChatInputProps } from '../Chat/Chat.types';
import TextField from '@mui/material/TextField';
import { parseCSS } from '@/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { chatSliceActions } from '@/store';
import { ChatState } from '@/store/store.types';

const ChatInput: React.FC<ChatInputProps> = ({ className, setMessage = () => {} }) => {
   const toSend = useRef<boolean>(false);
   const value = useSelector((state: { chat: ChatState }) => state.chat.inputValue);
   const dispatch = useDispatch();

   const setInput = (input: string) => {
      dispatch(chatSliceActions.setInput(input));
   };

   const handleInput = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
      const input: string = ev.target.value;

      if (toSend.current) {
         return setMessage();
      }
      
      setInput(input);
   }

   const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>): void => {
      toSend.current = Boolean(!ev.shiftKey && ev.key === 'Enter');
   }

   return <TextField
      className={parseCSS(className, 'chat-input')}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      variant="filled"
      value={value}
      hiddenLabel
      multiline
      fullWidth
   />;
};

export default ChatInput;
