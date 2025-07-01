import Message from '@/models/Message';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { ChatState } from './store.types';

const INIT_STATE: ChatState = {
   history: [],
   inputValue: '',
   chatState: false
};

const chatSlice = createSlice({
   name: 'chat',
   initialState: INIT_STATE,
   reducers: {
      toggleChat: (state) => {
         state.chatState = !state.chatState;
      },
      setInput: (state, action) => {
         state.inputValue = action.payload;
      },
      setMessage: (state, action) => {
         let message;

         if (action.payload?.message) {
            message = new Message({ timestamp: action.payload?.timestamp, content: action.payload.message, self: action.payload?.self });
         } else {
            message = new Message({ content: state.inputValue, self: action.payload?.self });
         }

         if (!action.payload?.self || state.inputValue) {
            state.history.push(message.serialize());
         }

         state.inputValue = '';
      },
      resetInput: (state) => {
         state.inputValue = '';
      }
   }
});

const store = configureStore({
   reducer: {
      chat: chatSlice.reducer
   }
});

export const chatSliceActions = chatSlice.actions;
export default store;
