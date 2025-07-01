import React, { useRef } from 'react';
import { ChatInputProps } from '../Chat.types';
import TextField from '@mui/material/TextField';
import { parseCSS } from '@/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { chatSliceActions } from '@/store';
import { ChatState } from '@/store/store.types';

const ChatInput: React.FC<ChatInputProps> = ({ className }) => {
   const toSend = useRef<boolean>(false);
   const value = useSelector((state: { chat: ChatState }) => state.chat.inputValue);
   const dispatch = useDispatch();

   const setInput = (input: string) => {
      dispatch(chatSliceActions.setInput(input));
   };

   const setMessage = () => {
      dispatch(chatSliceActions.setMessage({ self: true }));
   };

   const handleInput = (ev: React.ChangeEvent<HTMLTextAreaElement>): void => {
      const input: string = ev.target.value;

      if (!toSend.current) {
         return setInput(input);
      }

      setMessage();
   }

   const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>): void => {
      toSend.current = Boolean(ev.shiftKey && ev.key === 'Enter');
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
