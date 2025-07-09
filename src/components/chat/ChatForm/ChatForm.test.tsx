import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatForm from './ChatForm';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store } from '@reduxjs/toolkit';

// Mock the useSocket hook
jest.mock('@/services/SocketClient', () => ({
   useSocket: jest.fn(() => ({
      emit: jest.fn(),
   })),
}));

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn(() => ({
      textResources: {
         getText: jest.fn((key: string) => key),
      },
   })),
}));

// Mock the ChatInput component
jest.mock('..', () => ({
   ChatInput: () => (
      <div data-testid="chat-input">
         <input type="text" placeholder="Type a message..." />
      </div>
   ),
}));

const mockStore = configureStore([]);
const initialState = {
   chat: {
      inputValue: 'test message',
      threadID: 'test-thread',
   },
};

describe('ChatForm Component', () => {
   let store: Store;

   beforeEach(() => {
      store = mockStore(initialState);
      store.dispatch = jest.fn();
   });

   const renderWithStore = (ui: React.ReactElement) =>
      render(<Provider store={store}>{ui}</Provider>);

   it('renders the form', () => {
      renderWithStore(<ChatForm />);

      expect(screen.queryByTestId('chat-form')).toBeInTheDocument();
   });

   it('renders the send button', () => {
      renderWithStore(<ChatForm />);
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
   });

   it('dispatches setMessage on form submit', () => {
      renderWithStore(<ChatForm />);
      const form = screen.queryByTestId('chat-form');

      if (form) {
         fireEvent.submit(form);
         expect(store.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: expect.stringContaining('setMessage') })
         );
      } else {
         expect(form).toBeInTheDocument();
      }
   });

   it('dispatches setMessage when clicking the send button', () => {
      renderWithStore(<ChatForm />);
      const button = screen.getByRole('button', { name: /send/i });

      fireEvent.click(button);
      expect(store.dispatch).toHaveBeenCalledWith(
         expect.objectContaining({ type: expect.stringContaining('setMessage') })
      );
   });
});