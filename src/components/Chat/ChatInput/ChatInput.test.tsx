import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from './ChatInput';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const initialState = {
   chat: {
      inputValue: '',
   },
};

describe('ChatInput Component', () => {
   let store: ReturnType<typeof mockStore>;

   beforeEach(() => {
      store = mockStore(initialState);
      store.dispatch = jest.fn();
   });

   const renderWithStore = (ui: React.ReactElement) =>
      render(<Provider store={store}>{ui}</Provider>);

   const defaultProps = { setMessage: () => {} };

   it('Renders the TextField', () => {
      renderWithStore(<ChatInput {...defaultProps} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
   });

   it('Dispatches setInput on input change', () => {
      renderWithStore(<ChatInput {...defaultProps} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'hello' } });
      expect(store.dispatch).toHaveBeenCalledWith(
         expect.objectContaining({ type: expect.stringContaining('setInput'), payload: 'hello' })
      );
   });

   it('Calls setMessage when toSend is true', () => {
      const mockSetMessage = jest.fn();
      render(
         <Provider store={store}>
            <ChatInput setMessage={mockSetMessage} />
         </Provider>
      );
      const input = screen.getByRole('textbox');

      // Simulate Shift+Enter keydown to set toSend.current = true
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
      fireEvent.change(input, { target: { value: 'send this' } });

      expect(mockSetMessage).toHaveBeenCalled();
   });

   it('Shows the correct value from redux', () => {
      store = mockStore({ chat: { inputValue: 'preset' } });

      render(
         <Provider store={store}>
            <ChatInput {...defaultProps} />
         </Provider>
      );
      expect(screen.getByDisplayValue('preset')).toBeInTheDocument();
   });
});
