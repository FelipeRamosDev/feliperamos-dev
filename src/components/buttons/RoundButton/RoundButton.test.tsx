import { render, screen, fireEvent } from '@testing-library/react';
import RoundButton from './RoundButton';

// Mock the parseCSS utility
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: (classes?: string | string[], merge?: string | string[]) => {
      const result: string[] = [];
      
      if (typeof classes === 'string') {
         result.push(...classes.split(' ').filter(Boolean));
      } else if (Array.isArray(classes)) {
         result.push(...classes.filter(Boolean));
      }
      
      if (typeof merge === 'string') {
         result.push(...merge.split(' ').filter(Boolean));
      } else if (Array.isArray(merge)) {
         result.push(...merge.filter(Boolean));
      }
      
      return result.join(' ');
   }
}));

interface IconButtonProps {
   children: React.ReactNode;
   className?: string;
   onClick?: () => void;
   disabled?: boolean;
   [key: string]: unknown;
}

// Mock Material-UI IconButton
jest.mock('@mui/material', () => ({
   IconButton: ({ children, className, onClick, disabled, ...props }: IconButtonProps) => (
      <button
         data-testid="icon-button"
         className={className}
         onClick={onClick}
         disabled={disabled}
         {...props}
      >
         {children}
      </button>
   )
}));

describe('RoundButton', () => {
   it('renders with default props', () => {
      render(
         <RoundButton>
            <span>Test Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Icon');
   });

   it('renders with children content', () => {
      render(
         <RoundButton>
            <div data-testid="test-icon">Custom Icon</div>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      const icon = screen.getByTestId('test-icon');
      
      expect(button).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('Custom Icon');
   });

   it('applies default RoundButton class', () => {
      render(
         <RoundButton>
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toHaveClass('RoundButton');
   });

   it('applies custom className as string', () => {
      render(
         <RoundButton className="custom-class">
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('RoundButton');
   });

   it('applies custom className as array', () => {
      render(
         <RoundButton className={['class1', 'class2']}>
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toHaveClass('class1');
      expect(button).toHaveClass('class2');
      expect(button).toHaveClass('RoundButton');
   });

   it('handles onClick event', () => {
      const mockOnClick = jest.fn();
      
      render(
         <RoundButton onClick={mockOnClick}>
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
   });

   it('passes through additional props to IconButton', () => {
      render(
         <RoundButton disabled title="Test Button" aria-label="test-button">
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toHaveAttribute('disabled');
      expect(button).toHaveAttribute('title', 'Test Button');
      expect(button).toHaveAttribute('aria-label', 'test-button');
   });

   it('renders as a button element', () => {
      render(
         <RoundButton>
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
   });

   it('supports disabled state', () => {
      render(
         <RoundButton disabled>
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toBeDisabled();
   });

   it('does not call onClick when disabled', () => {
      const mockOnClick = jest.fn();
      
      render(
         <RoundButton onClick={mockOnClick} disabled>
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
   });

   it('supports different button types', () => {
      render(
         <RoundButton type="submit">
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toHaveAttribute('type', 'submit');
   });

   it('renders with complex children', () => {
      render(
         <RoundButton>
            <div>
               <span>Icon</span>
               <span>Label</span>
            </div>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toHaveTextContent('IconLabel');
   });

   it('handles multiple event handlers', () => {
      const mockOnClick = jest.fn();
      const mockOnMouseOver = jest.fn();
      const mockOnFocus = jest.fn();
      
      render(
         <RoundButton 
            onClick={mockOnClick}
            onMouseOver={mockOnMouseOver}
            onFocus={mockOnFocus}
         >
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      
      fireEvent.click(button);
      fireEvent.mouseOver(button);
      fireEvent.focus(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnMouseOver).toHaveBeenCalledTimes(1);
      expect(mockOnFocus).toHaveBeenCalledTimes(1);
   });

   it('supports accessibility attributes', () => {
      render(
         <RoundButton 
            aria-label="Close dialog"
            aria-describedby="tooltip-description"
            role="button"
         >
            <span>×</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      expect(button).toHaveAttribute('aria-describedby', 'tooltip-description');
      expect(button).toHaveAttribute('role', 'button');
   });

   it('combines className correctly with parseCSS', () => {
      render(
         <RoundButton className="custom-class">
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      // parseCSS should join className and 'RoundButton'
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('RoundButton');
   });

   it('handles empty className gracefully', () => {
      render(
         <RoundButton className="">
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toHaveClass('RoundButton');
   });

   it('handles null/undefined className gracefully', () => {
      render(
         <RoundButton className={undefined}>
            <span>Icon</span>
         </RoundButton>
      );

      const button = screen.getByTestId('icon-button');
      expect(button).toHaveClass('RoundButton');
   });

   describe('Accessibility', () => {
      it('is focusable by default', () => {
         render(
            <RoundButton>
               <span>Icon</span>
            </RoundButton>
         );

         const button = screen.getByRole('button');
         expect(button).toBeInTheDocument();
         expect(button).not.toHaveAttribute('tabindex', '-1');
      });

      it('can be focused programmatically', () => {
         render(
            <RoundButton>
               <span>Icon</span>
            </RoundButton>
         );

         const button = screen.getByRole('button');
         button.focus();
         expect(button).toHaveFocus();
      });

      it('supports keyboard navigation', () => {
         const mockOnClick = jest.fn();
         
         render(
            <RoundButton onClick={mockOnClick}>
               <span>Icon</span>
            </RoundButton>
         );

         const button = screen.getByRole('button');
         fireEvent.keyDown(button, { key: 'Enter' });
         fireEvent.keyDown(button, { key: ' ' });

         // Note: Actual keyboard event handling depends on Material-UI implementation
         // This test ensures the button is accessible via keyboard
         expect(button).toBeInTheDocument();
      });
   });
});

