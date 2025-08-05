import { render, screen, fireEvent } from '@testing-library/react';
import EditButtons from './EditButtons';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import React from 'react';

// Mock text file to prevent TextResources circular dependency
jest.mock('./EditButtons.text', () => ({}));

// Mock Markdown component to avoid ESM import issues with 'marked'
jest.mock('@/components/common/Markdown/Markdown', () => {
   const MockMarkdown = () => <div data-testid="markdown-mock" />;
   MockMarkdown.displayName = 'MockMarkdown';
   return MockMarkdown;
});

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

// Mock RoundButton component
jest.mock('../RoundButton/RoundButton', () => {
   const RoundButton = ({ children, title, 'aria-label': ariaLabel, className, color, onClick, ...props }: {
      children: React.ReactNode;
      title?: string;
      'aria-label'?: string;
      className?: string;
      color?: string;
      onClick?: () => void;
      [key: string]: unknown;
   }) => (
      <button
         data-testid="round-button"
         title={title}
         aria-label={ariaLabel}
         className={className}
         data-color={color}
         onClick={onClick}
         {...props}
      >
         {children}
      </button>
   );
   RoundButton.displayName = 'RoundButton';
   return RoundButton;
});

// Mock Material-UI Icons
jest.mock('@mui/icons-material', () => ({
   Edit: () => <span data-testid="EditIcon">Edit Icon</span>,
   Close: () => <span data-testid="CloseIcon">Close Icon</span>
}));

describe('EditButtons', () => {
   const mockTextResources = {
      getText: jest.fn(),
      currentLanguage: 'en'
   };
   const mockSetEditMode = jest.fn();

   beforeEach(() => {
      jest.clearAllMocks();
      (useTextResources as jest.Mock).mockReturnValue({
         textResources: mockTextResources
      });

      // Set up default text resource responses
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'EditButtons.title.edit': 'Edit',
            'EditButtons.title.cancel': 'Cancel'
         };
         return texts[key] || key;
      });
   });

   describe('Edit mode disabled (default)', () => {
      it('renders edit button by default', () => {
         render(<EditButtons setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         expect(button).toBeInTheDocument();
         expect(button).toHaveAttribute('title', 'Edit');
         expect(button).toHaveAttribute('aria-label', 'Edit');
         expect(button).toHaveAttribute('data-color', 'background');
         expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
      });

      it('calls setEditMode(true) when edit button is clicked', () => {
         render(<EditButtons setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         fireEvent.click(button);

         expect(mockSetEditMode).toHaveBeenCalledWith(true);
      });

      it('uses custom title when provided', () => {
         render(<EditButtons title="Custom Edit" setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         expect(button).toHaveAttribute('title', 'Custom Edit');
         expect(button).toHaveAttribute('aria-label', 'Custom Edit');
      });

      it('applies custom className', () => {
         render(<EditButtons className="custom-class" setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         expect(button).toHaveClass('custom-class');
      });

      it('uses custom edit color', () => {
         render(<EditButtons editColor="primary" setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         expect(button).toHaveAttribute('data-color', 'primary');
      });
   });

   describe('Edit mode enabled', () => {
      it('renders cancel button when editMode is true', () => {
         render(<EditButtons editMode={true} setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         expect(button).toBeInTheDocument();
         expect(button).toHaveAttribute('title', 'Cancel');
         expect(button).toHaveAttribute('aria-label', 'Cancel');
         expect(button).toHaveAttribute('data-color', 'error');
         expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
      });

      it('calls setEditMode(false) when cancel button is clicked', () => {
         render(<EditButtons editMode={true} setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         fireEvent.click(button);

         expect(mockSetEditMode).toHaveBeenCalledWith(false);
      });

      it('uses custom cancel color', () => {
         render(<EditButtons editMode={true} cancelColor="secondary" setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         expect(button).toHaveAttribute('data-color', 'secondary');
      });

      it('uses custom title for cancel button', () => {
         render(<EditButtons editMode={true} title="Custom Cancel" setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         expect(button).toHaveAttribute('title', 'Custom Cancel');
         expect(button).toHaveAttribute('aria-label', 'Custom Cancel');
      });
   });

   describe('TextResources integration', () => {
      it('uses TextResources for button titles', () => {
         render(<EditButtons setEditMode={mockSetEditMode} />);

         expect(useTextResources).toHaveBeenCalledTimes(1);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditButtons.title.edit');
      });

      it('uses TextResources for cancel button titles', () => {
         render(<EditButtons editMode={true} setEditMode={mockSetEditMode} />);

         expect(mockTextResources.getText).toHaveBeenCalledWith('EditButtons.title.cancel');
      });

      it('falls back to provided title over TextResources', () => {
         render(<EditButtons title="Override Title" setEditMode={mockSetEditMode} />);

         const button = screen.getByTestId('round-button');
         expect(button).toHaveAttribute('title', 'Override Title');
      });
   });

   describe('Props forwarding', () => {
      it('forwards additional props to RoundButton', () => {
         render(
            <EditButtons 
               setEditMode={mockSetEditMode}
               data-custom="test-value"
            />
         );

         const button = screen.getByTestId('round-button');
         expect(button).toHaveAttribute('data-custom', 'test-value');
      });
   });

   describe('Default behavior without setEditMode', () => {
      it('handles missing setEditMode gracefully', () => {
         expect(() => render(<EditButtons />)).not.toThrow();
         
         const button = screen.getByTestId('round-button');
         expect(button).toBeInTheDocument();
         
         // Should not throw when clicked
         expect(() => fireEvent.click(button)).not.toThrow();
      });
   });
});
