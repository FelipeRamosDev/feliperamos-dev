import { createSlice, configureStore } from '@reduxjs/toolkit';
import { ChatState } from './store.types';


const INIT_STATE: ChatState = {
   history: [],
   inputValue: '',
   chatState: false,
   threadID: null,
   assistantTyping: false
};

const chatSlice = createSlice({
   name: 'chat',
   initialState: INIT_STATE,
   reducers: {
      toggleChat: (state) => {
         state.chatState = !state.chatState;
      },
      setAssistantTyping: (state, action) => {
         const typingStatus = action.payload;
         state.assistantTyping = typingStatus;
      },
      setInput: (state, action) => {
         state.inputValue = action.payload;
      },
      setMessage: (state, action) => {
         const message = action.payload;

         if (!message) {
            return;
         }

         if (!message.self) {
            // Handle assistant message
            state.history.push(message);
         } else if (state.inputValue) {
            // Handle user message
            state.history.push(message);
         }

         state.inputValue = '';
      },
      setThreadID: (state, action) => {
         if (action.payload === state.threadID) {
            return;
         }

         state.threadID = action.payload;
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
