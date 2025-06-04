import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ChatMessage from '.';
import Message from '@/models/Message';

describe('ChatMessage Component', () => {
   it('Renders the message text', () => {
      const message = new Message({ content: 'Hello, world!' });

      render(<ChatMessage index={0} message={message} />);
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
   });

   it('Do not render the component if no message was provided', () => {
      const message = new Message({ content: '' });

      render(<ChatMessage index={0} message={message} />);
      expect(screen.queryByTestId('chat-message-0')).not.toBeInTheDocument();
   });

   it('Renders the message text as bot', () => {
      const message = new Message({ content: 'This is a bot message' });

      render(<ChatMessage index={0} message={message} />);
      expect(screen.queryByTestId('chat-message-0')).not.toHaveClass('is-self');
   });

   it('Renders the message text as a user', () => {
      const message = new Message({ content: 'This is a user message', self: true });

      render(<ChatMessage index={0} message={message} />);
      expect(screen.queryByTestId('chat-message-0')).toHaveClass('is-self');
   });

   it('Should have message date string', () => {
      const message = new Message({ content: 'Testing the message date', self: true });

      render(<ChatMessage index={0} message={message} />);
      expect(screen.queryByTestId('message-date-0')).toHaveTextContent(message.dateString);
   });

   it('Should have message time string', () => {
      const message = new Message({ content: 'Testing the message date', self: true });

      render(<ChatMessage index={0} message={message} />);
      expect(screen.queryByTestId('message-time-0')).toHaveTextContent(message.timeString);
   });
});
