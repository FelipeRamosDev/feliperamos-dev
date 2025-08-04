import { render, screen } from '@testing-library/react';
import ErrorTile from './ErrorTile';

// Mock the Card component
jest.mock('@/components/common', () => ({
   Card: ({ children, className, elevation, radius, padding, ...props }: any) => (
      <div
         data-testid="card"
         className={className}
         data-elevation={elevation}
         data-radius={radius}
         data-padding={padding}
         {...props}
      >
         {children}
      </div>
   )
}));

describe('ErrorTile', () => {
   it('renders error message when error is provided', () => {
      const error = { message: 'Something went wrong' };
      render(<ErrorTile error={error} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toHaveClass('error-message');
   });

   it('renders with correct Card props', () => {
      const error = { message: 'Test error' };
      render(<ErrorTile error={error} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('ErrorTile');
      expect(card).toHaveAttribute('data-elevation', 'm');
      expect(card).toHaveAttribute('data-radius', 's');
      expect(card).toHaveAttribute('data-padding', 's');
   });

   it('returns null when error is null', () => {
      const { container } = render(<ErrorTile error={null} />);
      expect(container.firstChild).toBeNull();
   });

   it('returns null when error is undefined', () => {
      const { container } = render(<ErrorTile />);
      expect(container.firstChild).toBeNull();
   });

   it('returns null when error has no message', () => {
      const error = {};
      const { container } = render(<ErrorTile error={error} />);
      expect(container.firstChild).toBeNull();
   });

   it('returns null when error message is empty', () => {
      const error = { message: '' };
      const { container } = render(<ErrorTile error={error} />);
      expect(container.firstChild).toBeNull();
   });

   it('renders long error messages', () => {
      const longMessage = 'This is a very long error message that should still be displayed properly without any issues in the error tile component.';
      const error = { message: longMessage };
      render(<ErrorTile error={error} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
   });

   it('renders error messages with special characters', () => {
      const specialMessage = 'Error: <script>alert("xss")</script> & "quotes" and \'apostrophes\'';
      const error = { message: specialMessage };
      render(<ErrorTile error={error} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
   });

   it('renders proper semantic HTML structure', () => {
      const error = { message: 'Test error' };
      render(<ErrorTile error={error} />);

      const errorParagraph = screen.getByText('Test error');
      expect(errorParagraph.tagName.toLowerCase()).toBe('p');
      expect(errorParagraph).toHaveClass('error-message');
   });
});
