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
      setMessage: (state) => {
         const message = new Message({ content: state.inputValue, self: true });

         if (state.inputValue) {
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
