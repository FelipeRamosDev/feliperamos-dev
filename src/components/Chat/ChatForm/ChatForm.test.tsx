import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatForm from './ChatForm';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const initialState = {
   chat: {
      inputValue: '',
   },
};

describe('ChatForm Component', () => {
   let store: any;

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
      expect(screen.getByRole('button')).toBeInTheDocument();
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
      const button = screen.getByRole('button');

      fireEvent.click(button);
      expect(store.dispatch).toHaveBeenCalledWith(
         expect.objectContaining({ type: expect.stringContaining('setMessage') })
      );
   });
});