import { parseCSS } from '@/utils/parse';
import React, { FormEvent } from 'react';
import { ChatFormProps } from '../Chat/Chat.types';
import { ChatInput } from '..';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { chatSliceActions } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { ChatState } from '@/store/store.types';
import Message from '@/models/Message';
import { useSocket } from '@/services/SocketClient';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import chatFormText from './ChatForm.text';

const ChatForm: React.FC<ChatFormProps> = ({ className }) => {
   const inputValue = useSelector((state: { chat: ChatState }) => state.chat.inputValue);
   const threadID = useSelector((state: { chat: ChatState }) => state.chat.threadID);
   const dispatch = useDispatch();
   const { emit } = useSocket();
   const { textResources } = useTextResources(chatFormText);

   const setMessage = () => {
      const message = new Message({ content: inputValue, threadID });
      const serialized = message.serialize();

      dispatch(chatSliceActions.setMessage(serialized));
      emit('assistant-inbox', serialized);
   }

   const handleSend = (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      setMessage();
   }

   return (
      <form
         data-testid="chat-form"
         className={parseCSS(className, 'chat-form')}
         onSubmit={handleSend}
      >
         <ChatInput setMessage={setMessage} />

         <div className="send-button">
            <IconButton
               className="icon-button"
               type="submit"
               color="primary"
               size="large"
               title={textResources.getText('ChatForm.buttonTitle.send')}
            >
               <SendIcon />
            </IconButton>
         </div>
      </form>
   );
};

export default ChatForm;
