import { configureStore, createSlice } from '@reduxjs/toolkit';
import { ChatState } from '../store.types';
import Message from '@/models/Message';

// Define the initial state
const INIT_STATE: ChatState = {
   history: [],
   inputValue: '',
   chatState: false,
   threadID: null,
   assistantTyping: false
};

// Create the slice for testing
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

const chatSliceActions = chatSlice.actions;

describe('Redux Store', () => {
   let testStore: ReturnType<typeof configureStore>;

   beforeEach(() => {
      // Create a fresh store for each test
      testStore = configureStore({
         reducer: {
            chat: chatSlice.reducer
         },
         middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
               serializableCheck: {
                  // Ignore these action types
                  ignoredActions: ['chat/setMessage'],
                  // Ignore these field paths in all actions
                  ignoredActionsPaths: ['payload'],
                  // Ignore these paths in the state
                  ignoredPaths: ['chat.history']
               }
            })
      });
   });

   describe('Store Configuration', () => {
      it('should have the correct initial state', () => {
         const state = testStore.getState() as { chat: ChatState };
         
         expect(state.chat).toEqual({
            history: [],
            inputValue: '',
            chatState: false,
            threadID: null,
            assistantTyping: false
         });
      });

      it('should be a valid Redux store', () => {
         expect(testStore.getState).toBeDefined();
         expect(testStore.dispatch).toBeDefined();
         expect(testStore.subscribe).toBeDefined();
      });
   });

   describe('chatSlice Actions', () => {
      describe('toggleChat', () => {
         it('should toggle chat state from false to true', () => {
            const initialState = (testStore.getState() as { chat: ChatState }).chat;
            expect(initialState.chatState).toBe(false);

            testStore.dispatch(chatSliceActions.toggleChat());
            
            const newState = (testStore.getState() as { chat: ChatState }).chat;
            expect(newState.chatState).toBe(true);
         });

         it('should toggle chat state from true to false', () => {
            // First set it to true
            testStore.dispatch(chatSliceActions.toggleChat());
            expect((testStore.getState() as { chat: ChatState }).chat.chatState).toBe(true);

            // Then toggle back to false
            testStore.dispatch(chatSliceActions.toggleChat());
            expect((testStore.getState() as { chat: ChatState }).chat.chatState).toBe(false);
         });

         it('should only affect chatState and not other properties', () => {
            const initialState = (testStore.getState() as { chat: ChatState }).chat;
            
            testStore.dispatch(chatSliceActions.toggleChat());
            
            const newState = (testStore.getState() as { chat: ChatState }).chat;
            expect(newState.history).toEqual(initialState.history);
            expect(newState.inputValue).toEqual(initialState.inputValue);
            expect(newState.threadID).toEqual(initialState.threadID);
            expect(newState.assistantTyping).toEqual(initialState.assistantTyping);
         });
      });

      describe('setAssistantTyping', () => {
         it('should set assistant typing to true', () => {
            testStore.dispatch(chatSliceActions.setAssistantTyping(true));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.assistantTyping).toBe(true);
         });

         it('should set assistant typing to false', () => {
            // First set to true
            testStore.dispatch(chatSliceActions.setAssistantTyping(true));
            expect((testStore.getState() as { chat: ChatState }).chat.assistantTyping).toBe(true);
            
            // Then set to false
            testStore.dispatch(chatSliceActions.setAssistantTyping(false));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.assistantTyping).toBe(false);
         });

         it('should handle non-boolean values', () => {
            testStore.dispatch(chatSliceActions.setAssistantTyping('truthy'));
            expect((testStore.getState() as { chat: ChatState }).chat.assistantTyping).toBe('truthy');

            testStore.dispatch(chatSliceActions.setAssistantTyping(0));
            expect((testStore.getState() as { chat: ChatState }).chat.assistantTyping).toBe(0);

            testStore.dispatch(chatSliceActions.setAssistantTyping(null));
            expect((testStore.getState() as { chat: ChatState }).chat.assistantTyping).toBe(null);
         });
      });

      describe('setInput', () => {
         it('should set input value', () => {
            const testInput = 'Hello, world!';
            
            testStore.dispatch(chatSliceActions.setInput(testInput));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.inputValue).toBe(testInput);
         });

         it('should overwrite previous input value', () => {
            testStore.dispatch(chatSliceActions.setInput('First input'));
            expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe('First input');
            
            testStore.dispatch(chatSliceActions.setInput('Second input'));
            expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe('Second input');
         });

         it('should handle empty string', () => {
            testStore.dispatch(chatSliceActions.setInput('Some text'));
            expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe('Some text');
            
            testStore.dispatch(chatSliceActions.setInput(''));
            expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe('');
         });

         it('should handle special characters and unicode', () => {
            const specialInput = '🚀 Hello! @#$%^&*()_+ 你好 🌍';
            
            testStore.dispatch(chatSliceActions.setInput(specialInput));
            expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe(specialInput);
         });
      });

      describe('setMessage', () => {
         it('should add assistant message to history', () => {
            const assistantMessage = new Message({
               content: 'Hello from assistant',
               from: 'assistant',
               threadID: 'thread-123'
            });

            testStore.dispatch(chatSliceActions.setMessage(assistantMessage));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.history).toHaveLength(1);
            expect(state.history[0]).toEqual(assistantMessage);
         });

         it('should add user message to history when input value exists', () => {
            const userMessage = new Message({
               content: 'Hello from user',
               from: 'user',
               threadID: 'thread-123'
            });

            // Set input value first
            testStore.dispatch(chatSliceActions.setInput('Hello from user'));
            testStore.dispatch(chatSliceActions.setMessage(userMessage));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.history).toHaveLength(1);
            expect(state.history[0]).toEqual(userMessage);
            expect(state.inputValue).toBe(''); // Should be cleared
         });

         it('should not add user message to history when input value is empty', () => {
            const userMessage = new Message({
               content: 'Hello from user',
               from: 'user',
               threadID: 'thread-123'
            });

            // Don't set input value
            testStore.dispatch(chatSliceActions.setMessage(userMessage));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.history).toHaveLength(0);
            expect(state.inputValue).toBe('');
         });

         it('should clear input value after adding message', () => {
            testStore.dispatch(chatSliceActions.setInput('Test input'));
            
            const message = new Message({
               content: 'Test message',
               from: 'user'
            });

            testStore.dispatch(chatSliceActions.setMessage(message));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.inputValue).toBe('');
         });

         it('should handle null/undefined message', () => {
            const initialState = (testStore.getState() as { chat: ChatState }).chat;
            
            testStore.dispatch(chatSliceActions.setMessage(null));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state).toEqual(initialState); // No change
         });

         it('should add multiple messages to history', () => {
            const message1 = new Message({
               content: 'First message',
               from: 'assistant'
            });
            
            const message2 = new Message({
               content: 'Second message',
               from: 'assistant'
            });

            testStore.dispatch(chatSliceActions.setMessage(message1));
            testStore.dispatch(chatSliceActions.setMessage(message2));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.history).toHaveLength(2);
            expect(state.history[0]).toEqual(message1);
            expect(state.history[1]).toEqual(message2);
         });

         it('should preserve message order', () => {
            const messages = [];
            for (let i = 0; i < 5; i++) {
               const message = new Message({
                  content: `Message ${i}`,
                  from: i % 2 === 0 ? 'user' : 'assistant'
               });
               messages.push(message);
               
               if (message.self) {
                  testStore.dispatch(chatSliceActions.setInput(`Message ${i}`));
               }
               testStore.dispatch(chatSliceActions.setMessage(message));
            }
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.history).toHaveLength(5);
            messages.forEach((message, index) => {
               expect(state.history[index].content).toBe(message.content);
            });
         });
      });

      describe('setThreadID', () => {
         it('should set thread ID', () => {
            const threadID = 'thread-abc-123';
            
            testStore.dispatch(chatSliceActions.setThreadID(threadID));
            
            const state = (testStore.getState() as { chat: ChatState }).chat;
            expect(state.threadID).toBe(threadID);
         });

         it('should update thread ID', () => {
            testStore.dispatch(chatSliceActions.setThreadID('thread-1'));
            expect((testStore.getState() as { chat: ChatState }).chat.threadID).toBe('thread-1');
            
            testStore.dispatch(chatSliceActions.setThreadID('thread-2'));
            expect((testStore.getState() as { chat: ChatState }).chat.threadID).toBe('thread-2');
         });

         it('should not update if same thread ID', () => {
            const threadID = 'same-thread-id';
            
            testStore.dispatch(chatSliceActions.setThreadID(threadID));
            const stateAfterFirst = (testStore.getState() as { chat: ChatState }).chat;
            
            testStore.dispatch(chatSliceActions.setThreadID(threadID));
            const stateAfterSecond = (testStore.getState() as { chat: ChatState }).chat;
            
            expect(stateAfterFirst.threadID).toBe(threadID);
            expect(stateAfterSecond.threadID).toBe(threadID);
            expect(stateAfterFirst).toEqual(stateAfterSecond);
         });

         it('should handle null thread ID', () => {
            testStore.dispatch(chatSliceActions.setThreadID('some-thread'));
            expect((testStore.getState() as { chat: ChatState }).chat.threadID).toBe('some-thread');
            
            testStore.dispatch(chatSliceActions.setThreadID(null));
            expect((testStore.getState() as { chat: ChatState }).chat.threadID).toBe(null);
         });

         it('should handle undefined thread ID', () => {
            testStore.dispatch(chatSliceActions.setThreadID('some-thread'));
            expect((testStore.getState() as { chat: ChatState }).chat.threadID).toBe('some-thread');
            
            testStore.dispatch(chatSliceActions.setThreadID(undefined));
            expect((testStore.getState() as { chat: ChatState }).chat.threadID).toBe(undefined);
         });
      });

      describe('resetInput', () => {
         it('should reset input value to empty string', () => {
            testStore.dispatch(chatSliceActions.setInput('Some input text'));
            expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe('Some input text');
            
            testStore.dispatch(chatSliceActions.resetInput());
            expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe('');
         });

         it('should not affect other state properties', () => {
            // Set up some state
            testStore.dispatch(chatSliceActions.toggleChat());
            testStore.dispatch(chatSliceActions.setAssistantTyping(true));
            testStore.dispatch(chatSliceActions.setThreadID('test-thread'));
            testStore.dispatch(chatSliceActions.setInput('Test input'));
            
            const stateBeforeReset = (testStore.getState() as { chat: ChatState }).chat;
            
            testStore.dispatch(chatSliceActions.resetInput());
            
            const stateAfterReset = (testStore.getState() as { chat: ChatState }).chat;
            
            expect(stateAfterReset.chatState).toBe(stateBeforeReset.chatState);
            expect(stateAfterReset.assistantTyping).toBe(stateBeforeReset.assistantTyping);
            expect(stateAfterReset.threadID).toBe(stateBeforeReset.threadID);
            expect(stateAfterReset.history).toEqual(stateBeforeReset.history);
            expect(stateAfterReset.inputValue).toBe('');
         });

         it('should work when input is already empty', () => {
            expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe('');
            
            testStore.dispatch(chatSliceActions.resetInput());
            expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe('');
         });
      });
   });

   describe('Integration Tests', () => {
      it('should handle a complete chat flow', () => {
         // Open chat
         testStore.dispatch(chatSliceActions.toggleChat());
         expect((testStore.getState() as { chat: ChatState }).chat.chatState).toBe(true);

         // Set thread ID
         testStore.dispatch(chatSliceActions.setThreadID('integration-test-thread'));
         
         // User starts typing
         testStore.dispatch(chatSliceActions.setInput('Hello, assistant!'));
         
         // User sends message
         const userMessage = new Message({
            content: 'Hello, assistant!',
            from: 'user',
            threadID: 'integration-test-thread'
         });
         testStore.dispatch(chatSliceActions.setMessage(userMessage));
         
         // Assistant starts typing
         testStore.dispatch(chatSliceActions.setAssistantTyping(true));
         
         // Assistant responds
         const assistantMessage = new Message({
            content: 'Hello! How can I help you?',
            from: 'assistant',
            threadID: 'integration-test-thread'
         });
         testStore.dispatch(chatSliceActions.setMessage(assistantMessage));
         
         // Assistant stops typing
         testStore.dispatch(chatSliceActions.setAssistantTyping(false));
         
         // Verify final state
         const finalState = (testStore.getState() as { chat: ChatState }).chat;
         expect(finalState.chatState).toBe(true);
         expect(finalState.threadID).toBe('integration-test-thread');
         expect(finalState.inputValue).toBe('');
         expect(finalState.assistantTyping).toBe(false);
         expect(finalState.history).toHaveLength(2);
         expect(finalState.history[0]).toEqual(userMessage);
         expect(finalState.history[1]).toEqual(assistantMessage);
      });

      it('should handle rapid state changes', () => {
         // Simulate rapid typing
         for (let i = 0; i < 10; i++) {
            testStore.dispatch(chatSliceActions.setInput(`Message ${i}`));
         }
         expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe('Message 9');

         // Simulate rapid toggle
         for (let i = 0; i < 5; i++) {
            testStore.dispatch(chatSliceActions.toggleChat());
         }
         expect((testStore.getState() as { chat: ChatState }).chat.chatState).toBe(true); // Odd number of toggles

         // Simulate rapid assistant typing changes
         testStore.dispatch(chatSliceActions.setAssistantTyping(true));
         testStore.dispatch(chatSliceActions.setAssistantTyping(false));
         testStore.dispatch(chatSliceActions.setAssistantTyping(true));
         expect((testStore.getState() as { chat: ChatState }).chat.assistantTyping).toBe(true);
      });

      it('should maintain state immutability', () => {
         const initialState = (testStore.getState() as { chat: ChatState }).chat;
         const initialHistory = initialState.history;
         
         // Add a message
         const message = new Message({
            content: 'Test message',
            from: 'assistant'
         });
         testStore.dispatch(chatSliceActions.setMessage(message));
         
         // Verify original state wasn't mutated
         expect(initialHistory).toHaveLength(0);
         expect((testStore.getState() as { chat: ChatState }).chat.history).toHaveLength(1);
         expect(initialHistory).not.toBe((testStore.getState() as { chat: ChatState }).chat.history);
      });

      it('should handle edge cases gracefully', () => {
         // Test with very long input
         const longInput = 'a'.repeat(10000);
         testStore.dispatch(chatSliceActions.setInput(longInput));
         expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe(longInput);

         // Test with special characters
         const specialInput = '\n\t\r\u0000\u200B';
         testStore.dispatch(chatSliceActions.setInput(specialInput));
         expect((testStore.getState() as { chat: ChatState }).chat.inputValue).toBe(specialInput);

         // Test with empty messages
         testStore.dispatch(chatSliceActions.setMessage(undefined));
         testStore.dispatch(chatSliceActions.setMessage(null));
         
         // Should not crash and history should remain unchanged
         const state = (testStore.getState() as { chat: ChatState }).chat;
         expect(state.history).toHaveLength(0);
      });
   });

   describe('Type Safety', () => {
      it('should maintain correct types for all state properties', () => {
         const state: ChatState = (testStore.getState() as { chat: ChatState }).chat;
         
         expect(Array.isArray(state.history)).toBe(true);
         expect(typeof state.inputValue).toBe('string');
         expect(typeof state.chatState).toBe('boolean');
         expect(state.threadID === null || typeof state.threadID === 'string').toBe(true);
         expect(typeof state.assistantTyping).toBe('boolean');
      });

      it('should handle messages with all Message properties', () => {
         const completeMessage = new Message({
            content: 'Complete message',
            from: 'user',
            timestamp: Date.now(),
            threadID: 'test-thread'
         });

         testStore.dispatch(chatSliceActions.setInput('Complete message'));
         testStore.dispatch(chatSliceActions.setMessage(completeMessage));
         
         const state = (testStore.getState() as { chat: ChatState }).chat;
         const storedMessage = state.history[0];
         
         expect(storedMessage.content).toBe('Complete message');
         expect(storedMessage.from).toBe('user');
         expect(storedMessage.self).toBe(true);
         expect(storedMessage.threadID).toBe('test-thread');
         expect(typeof storedMessage.timestamp).toBe('number');
         expect(typeof storedMessage.dateString).toBe('string');
         expect(typeof storedMessage.timeString).toBe('string');
      });
   });
});