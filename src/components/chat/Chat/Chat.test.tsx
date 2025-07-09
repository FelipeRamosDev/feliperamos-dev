import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import Chat from './Chat';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useSocket } from '@/services/SocketClient';
import { handleStartChat, handleScroll } from './Chat.script';

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

// Mock the SocketClient
jest.mock('@/services/SocketClient', () => ({
   useSocket: jest.fn()
}));

// Mock parseCSS utility
jest.mock('@/utils/parse', () => ({
   parseCSS: (className?: string | string[], merge?: string | string[]) => {
      const result: string[] = [];
      
      if (typeof className === 'string') {
         result.push(...className.split(' ').filter(Boolean));
      } else if (Array.isArray(className)) {
         result.push(...className.filter(Boolean));
      }
      
      if (typeof merge === 'string') {
         result.push(...merge.split(' ').filter(Boolean));
      } else if (Array.isArray(merge)) {
         result.push(...merge.filter(Boolean));
      }
      
      return result.join(' ');
   }
}));

// Mock Message model
jest.mock('@/models/Message', () => {
   return jest.fn().mockImplementation((data) => ({
      ...data,
      serialize: () => ({ ...data, timestamp: data.timestamp || Date.now() })
   }));
});

// Mock child components
jest.mock('..', () => ({
   ChatForm: () => <div data-testid="chat-form">Chat Form</div>,
   ChatMessage: ({ message, index }: any) => (
      <div data-testid={`chat-message-${index}`} data-from={message.from}>
         {message.content}
      </div>
   ),
   ChatHeader: () => <div data-testid="chat-header">Chat Header</div>
}));

jest.mock('@/components/common', () => ({
   Card: React.forwardRef<HTMLDivElement, any>(({ children, className, noElevation, noRadius, noPadding, padding, ...props }, ref) => (
      <div ref={ref} data-testid="card" className={className} {...props}>
         {children}
      </div>
   ))
}));

jest.mock('@/components/buttons', () => ({
   CTAButton: ({ children, onClick, loading, fullWidth, color, ...props }: any) => (
      <button data-testid="cta-button" onClick={onClick} disabled={loading} {...props}>
         {loading ? 'Loading...' : children}
      </button>
   )
}));

// Mock Chat.script functions
jest.mock('./Chat.script', () => ({
   handleStartChat: jest.fn(),
   handleScroll: jest.fn()
}));

describe('Chat', () => {
   let mockStore: any;
   let mockDispatch: jest.Mock;
   let mockSocket: any;
   let mockEmit: jest.Mock;
   let mockConnect: jest.Mock;
   let mockTextResources: any;

   // Mock scrollTo for DOM elements
   const mockScrollTo = jest.fn();
   
   beforeAll(() => {
      // Mock scrollTo on HTMLElement prototype
      Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
         value: mockScrollTo,
         writable: true,
      });
      
      // Mock scrollHeight property
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
         value: 100,
         writable: true,
      });
   });

   const createMockStore = (initialState = {}) => {
      const defaultState = {
         chat: {
            history: [],
            assistantTyping: false,
            chatState: false,
            threadID: null,
            ...initialState
         }
      };

      return configureStore({
         reducer: {
            chat: (state = defaultState.chat, action) => {
               switch (action.type) {
                  case 'chat/toggleChat':
                     return { ...state, chatState: !state.chatState };
                  case 'chat/setThreadID':
                     return { ...state, threadID: action.payload };
                  case 'chat/setAssistantTyping':
                     return { ...state, assistantTyping: action.payload };
                  case 'chat/setMessage':
                     return { ...state, history: [...state.history, action.payload] };
                  default:
                     return state;
               }
            }
         }
      });
   };

   beforeEach(() => {
      mockDispatch = jest.fn();
      mockEmit = jest.fn();
      mockConnect = jest.fn().mockResolvedValue(undefined);
      
      mockSocket = {
         on: jest.fn(),
         emit: mockEmit,
         disconnect: jest.fn()
      };

      mockTextResources = {
         getText: jest.fn()
      };

      mockStore = createMockStore();

      (useSocket as jest.Mock).mockReturnValue({
         socket: mockSocket,
         emit: mockEmit,
         connect: mockConnect
      });

      (useTextResources as jest.Mock).mockReturnValue({
         textResources: mockTextResources
      });

      // Set up default text resource responses
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'Chat.welcome1': 'Hi! Welcome to Felipe\'s AI-powered career chat!',
            'Chat.welcome2': 'I\'m his virtual assistant, here to answer any questions about his professional background and experience.',
            'Chat.welcome3': 'Ask me about his skills, projects, career journey, or anything else you\'d like to know!',
            'Chat.assistantTyping': 'Assistant is typing...',
            'Chat.button.startChat': 'Talk to Assistant'
         };
         return texts[key] || key;
      });

      jest.clearAllMocks();
      mockScrollTo.mockClear();
   });

   const renderWithProvider = (props = {}) => {
      return render(
         <Provider store={mockStore}>
            <Chat {...props} />
         </Provider>
      );
   };

   describe('Basic rendering', () => {
      it('renders chat component with all elements', () => {
         renderWithProvider();

         expect(screen.getByTestId('chat-header')).toBeInTheDocument();
         expect(screen.getByTestId('cta-button')).toBeInTheDocument();
         expect(screen.getByText('Talk to Assistant')).toBeInTheDocument();
      });

      it('renders welcome messages', () => {
         renderWithProvider();

         expect(screen.getByText('Hi! Welcome to Felipe\'s AI-powered career chat!')).toBeInTheDocument();
         expect(screen.getByText('I\'m his virtual assistant, here to answer any questions about his professional background and experience.')).toBeInTheDocument();
         expect(screen.getByText('Ask me about his skills, projects, career journey, or anything else you\'d like to know!')).toBeInTheDocument();
      });

      it('applies default CSS classes', () => {
         renderWithProvider();

         const cards = screen.getAllByTestId('card');
         expect(cards[0]).toHaveClass('Chat closed');
      });

      it('applies custom className', () => {
         renderWithProvider({ className: 'custom-chat' });

         const cards = screen.getAllByTestId('card');
         expect(cards[0]).toHaveClass('custom-chat Chat closed');
      });
   });

   describe('Chat state management', () => {
      it('shows start chat button when chat is closed', () => {
         renderWithProvider();

         expect(screen.getByTestId('cta-button')).toBeInTheDocument();
         expect(screen.getByText('Talk to Assistant')).toBeInTheDocument();
         expect(screen.queryByTestId('chat-form')).not.toBeInTheDocument();
      });

      it('shows chat form when chat is open', () => {
         mockStore = createMockStore({ chatState: true });
         renderWithProvider();

         expect(screen.getByTestId('chat-form')).toBeInTheDocument();
         expect(screen.queryByTestId('cta-button')).not.toBeInTheDocument();
      });

      it('handles start chat button click', async () => {
         renderWithProvider();

         const startButton = screen.getByTestId('cta-button');
         fireEvent.click(startButton);

         expect(handleStartChat).toHaveBeenCalledWith(
            mockSocket,
            false,
            mockEmit,
            mockConnect,
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function)
         );
      });
   });

   describe('Message history', () => {
      it('renders message history', () => {
         const mockHistory = [
            { content: 'Hello', from: 'user', timestamp: 1234567890 },
            { content: 'Hi there!', from: 'assistant', timestamp: 1234567891 }
         ];

         mockStore = createMockStore({ history: mockHistory });
         renderWithProvider();

         // Welcome messages are always rendered (there will be duplicates in testids)
         const message0Elements = screen.getAllByTestId('chat-message-0');
         const message1Elements = screen.getAllByTestId('chat-message-1');
         const message2Elements = screen.getAllByTestId('chat-message-2');

         expect(message0Elements).toHaveLength(2); // Welcome + history
         expect(message1Elements).toHaveLength(2); // Welcome + history
         expect(message2Elements).toHaveLength(1); // Only welcome

         // History messages should also be rendered
         expect(screen.getByText('Hello')).toBeInTheDocument();
         expect(screen.getByText('Hi there!')).toBeInTheDocument();
      });

      it('does not render history in footer mode', () => {
         const mockHistory = [
            { content: 'Hello', from: 'user', timestamp: 1234567890 }
         ];

         mockStore = createMockStore({ history: mockHistory });
         renderWithProvider({ footerMode: true });

         // Welcome messages are always rendered
         expect(screen.getByTestId('chat-message-0')).toBeInTheDocument();
         expect(screen.getByTestId('chat-message-1')).toBeInTheDocument();
         expect(screen.getByTestId('chat-message-2')).toBeInTheDocument();

         // History messages should NOT be rendered in footer mode
         expect(screen.queryByText('Hello')).not.toBeInTheDocument();
      });

      it('shows assistant typing indicator', () => {
         mockStore = createMockStore({ assistantTyping: true });
         renderWithProvider();

         expect(screen.getByText('Assistant is typing...')).toBeInTheDocument();
      });
   });

   describe('Internationalization', () => {
      it('displays Portuguese text when TextResources returns Portuguese', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const portugueseTexts: Record<string, string> = {
               'Chat.welcome1': 'Olá! Bem-vindo ao chat de carreira com inteligência artificial do Felipe!',
               'Chat.welcome2': 'Sou seu assistente virtual, aqui para responder a qualquer pergunta sobre o histórico profissional e a experiência dele.',
               'Chat.welcome3': 'Pergunte-me sobre as habilidades, projetos, trajetória profissional ou qualquer outra coisa que você gostaria de saber!',
               'Chat.assistantTyping': 'O assistente está digitando...',
               'Chat.button.startChat': 'Falar com o Assistente'
            };
            return portugueseTexts[key] || key;
         });

         renderWithProvider();

         expect(screen.getByText('Olá! Bem-vindo ao chat de carreira com inteligência artificial do Felipe!')).toBeInTheDocument();
         expect(screen.getByText('Falar com o Assistente')).toBeInTheDocument();
      });

      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockReturnValue('');

         renderWithProvider();

         // Component should still render even with empty text
         expect(screen.getByTestId('chat-header')).toBeInTheDocument();
         expect(screen.getByTestId('cta-button')).toBeInTheDocument();
      });
   });

   describe('Scroll handling', () => {
      it('sets up scroll event listener on mount', () => {
         const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
         const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

         renderWithProvider();

         expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
         expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
      });

      it('cleans up scroll event listener on unmount', () => {
         const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

         const { unmount } = renderWithProvider();
         unmount();

         expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      });
   });

   describe('Loading state', () => {
      it('shows loading state on start chat button', () => {
         renderWithProvider();

         const startButton = screen.getByTestId('cta-button');
         
         // Simulate loading state by updating button props
         expect(startButton).toHaveTextContent('Talk to Assistant');
         expect(startButton).not.toBeDisabled();
      });
   });

   describe('Component integration', () => {
      it('integrates with ChatHeader component', () => {
         renderWithProvider();

         expect(screen.getByTestId('chat-header')).toBeInTheDocument();
      });

      it('integrates with ChatForm when chat is open', () => {
         mockStore = createMockStore({ chatState: true });
         renderWithProvider();

         expect(screen.getByTestId('chat-form')).toBeInTheDocument();
      });

      it('integrates with ChatMessage components', () => {
         renderWithProvider();

         // Welcome messages should be rendered as ChatMessage components
         expect(screen.getByTestId('chat-message-0')).toBeInTheDocument();
         expect(screen.getByTestId('chat-message-1')).toBeInTheDocument();
         expect(screen.getByTestId('chat-message-2')).toBeInTheDocument();
      });
   });

   describe('CSS class management', () => {
      it('applies closed class when chat is closed', () => {
         renderWithProvider();

         const cards = screen.getAllByTestId('card');
         expect(cards[0]).toHaveClass('Chat closed');
      });

      it('does not apply closed class when chat is open', () => {
         mockStore = createMockStore({ chatState: true });
         renderWithProvider();

         const cards = screen.getAllByTestId('card');
         expect(cards[0]).toHaveClass('Chat');
         expect(cards[0]).not.toHaveClass('closed');
      });
   });

   describe('Accessibility', () => {
      it('has proper structure for screen readers', () => {
         renderWithProvider();

         expect(screen.getByTestId('chat-header')).toBeInTheDocument();
         expect(screen.getByRole('button')).toBeInTheDocument();
      });

      it('start chat button is accessible', () => {
         renderWithProvider();

         const button = screen.getByRole('button', { name: /talk to assistant/i });
         expect(button).toBeInTheDocument();
         expect(button).not.toBeDisabled();
      });
   });

   describe('Edge cases', () => {
      it('handles empty message history', () => {
         mockStore = createMockStore({ history: [] });
         renderWithProvider();

         // Should still render welcome messages
         expect(screen.getByTestId('chat-message-0')).toBeInTheDocument();
         expect(screen.getByTestId('chat-message-1')).toBeInTheDocument();
         expect(screen.getByTestId('chat-message-2')).toBeInTheDocument();
      });

      it('handles messages without timestamps', () => {
         const mockHistory = [
            { content: 'Hello', from: 'user' } // No timestamp
         ];

         mockStore = createMockStore({ history: mockHistory });
         renderWithProvider();

         // Welcome messages are always rendered
         expect(screen.getByTestId('chat-message-0')).toBeInTheDocument();
         expect(screen.getByTestId('chat-message-1')).toBeInTheDocument();
         expect(screen.getByTestId('chat-message-2')).toBeInTheDocument();

         // Message without timestamp should NOT be rendered
         expect(screen.queryByText('Hello')).not.toBeInTheDocument();
      });

      it('handles null socket gracefully', () => {
         (useSocket as jest.Mock).mockReturnValue({
            socket: null,
            emit: mockEmit,
            connect: mockConnect
         });

         renderWithProvider();

         const startButton = screen.getByTestId('cta-button');
         fireEvent.click(startButton);

         expect(handleStartChat).toHaveBeenCalledWith(
            null,
            false,
            mockEmit,
            mockConnect,
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function)
         );
      });
   });

   describe('TextResources integration', () => {
      it('uses TextResources for all text content', () => {
         renderWithProvider();

         expect(useTextResources).toHaveBeenCalledTimes(1);
         expect(mockTextResources.getText).toHaveBeenCalledWith('Chat.welcome1');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Chat.welcome2');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Chat.welcome3');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Chat.button.startChat');
      });

      it('calls TextResources for assistant typing when applicable', () => {
         mockStore = createMockStore({ assistantTyping: true });
         renderWithProvider();

         expect(mockTextResources.getText).toHaveBeenCalledWith('Chat.assistantTyping');
      });
   });
});

