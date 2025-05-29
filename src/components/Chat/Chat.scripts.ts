import Message from '@/models/Message';
import { ChatState } from './Chat.types';

export function chatReducer(state: ChatState, action: { type: string; value: string }): ChatState {
   const { type, value } = action;

   switch (type) {
      case 'SET_INPUT':
         return { ...state, inputValue: value };
      case 'SET_MESSAGE':
         const message = new Message({ content: state.inputValue, self: true });

         if (state.inputValue) {
            state.history.push(message);
         }

         state.inputValue = '';
         return { ...state };
      case 'RESET':
         return { ...state, inputValue: '' }
      default:
         return state;
   }
}
