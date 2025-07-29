// Mock Markdown component to avoid ESM import issues with 'marked'
jest.mock('@/components/common/Markdown/Markdown', () => () => <div data-testid="markdown-mock" />);
import { render, screen } from '@testing-library/react';
import ChatHeader from './ChatHeader';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

interface AvatarProps {
   children?: React.ReactNode;
   className?: string;
   alt?: string;
}

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
   Avatar: ({ children, className, alt }: AvatarProps) => (
      <div data-testid="avatar" className={className} role="img" aria-label={alt}>
         {children}
      </div>
   )
}));

jest.mock('@mui/icons-material/SmartToy', () => {
   return function SmartToyIcon({ color }: { color?: string }) {
      return <span data-testid="smart-toy-icon" data-color={color}>🤖</span>;
   };
});

describe('ChatHeader', () => {
   const mockTextResources = {
      getText: jest.fn()
   };

   beforeEach(() => {
      jest.clearAllMocks();
      (useTextResources as jest.Mock).mockReturnValue({
         textResources: mockTextResources
      });

      // Set up default text resource responses
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'ChatHeader.assistantName': 'AI Assistant',
            'ChatHeader.assistantDescription': 'Trained AI with Felipe\'s professional background and experience, ask anything!',
            'ChatHeader.avatarAlt': 'AI Assistant Avatar'
         };
         return texts[key] || key;
      });
   });

   it('renders the chat header with all elements', () => {
      render(<ChatHeader />);

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
      expect(screen.getByTestId('smart-toy-icon')).toBeInTheDocument();
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
      expect(screen.getByText('Trained AI with Felipe\'s professional background and experience, ask anything!')).toBeInTheDocument();
   });

   it('uses TextResources for internationalization', () => {
      render(<ChatHeader />);

      expect(useTextResources).toHaveBeenCalledTimes(1);
      expect(mockTextResources.getText).toHaveBeenCalledWith('ChatHeader.assistantName');
      expect(mockTextResources.getText).toHaveBeenCalledWith('ChatHeader.assistantDescription');
      expect(mockTextResources.getText).toHaveBeenCalledWith('ChatHeader.avatarAlt');
   });

   it('renders with correct CSS classes and structure', () => {
      render(<ChatHeader />);

      const header = document.querySelector('.ChatHeader');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('ChatHeader');

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('assistant-avatar');

      const assistantInfo = document.querySelector('.assistant-info');
      expect(assistantInfo).toBeInTheDocument();

      const assistantName = screen.getByRole('heading', { level: 2 });
      expect(assistantName).toHaveClass('assistant-name');

      const assistantDescription = screen.getByText('Trained AI with Felipe\'s professional background and experience, ask anything!');
      expect(assistantDescription).toHaveClass('assistant-description');
   });

   it('renders avatar with correct alt text', () => {
      render(<ChatHeader />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('aria-label', 'AI Assistant Avatar');
   });

   it('renders SmartToyIcon with secondary color', () => {
      render(<ChatHeader />);

      const icon = screen.getByTestId('smart-toy-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-color', 'secondary');
   });

   it('renders assistant name as h2 heading', () => {
      render(<ChatHeader />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('AI Assistant');
   });

   it('renders assistant description as paragraph', () => {
      render(<ChatHeader />);

      const description = screen.getByText('Trained AI with Felipe\'s professional background and experience, ask anything!');
      expect(description.tagName).toBe('P');
   });

   describe('Internationalization scenarios', () => {
      it('displays Portuguese text when TextResources returns Portuguese', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const portugueseTexts: Record<string, string> = {
               'ChatHeader.assistantName': 'Assistente de IA',
               'ChatHeader.assistantDescription': 'IA treinada com o histórico profissional e a experiência do Felipe, pergunte qualquer coisa!',
               'ChatHeader.avatarAlt': 'Avatar do Assistente de IA'
            };
            return portugueseTexts[key] || key;
         });

         render(<ChatHeader />);

         expect(screen.getByText('Assistente de IA')).toBeInTheDocument();
         expect(screen.getByText('IA treinada com o histórico profissional e a experiência do Felipe, pergunte qualquer coisa!')).toBeInTheDocument();
         
         const avatar = screen.getByTestId('avatar');
         expect(avatar).toHaveAttribute('aria-label', 'Avatar do Assistente de IA');
      });

      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockReturnValue('');

         render(<ChatHeader />);

         // Component should still render even with empty text
         const header = document.querySelector('.ChatHeader');
         expect(header).toBeInTheDocument();
         expect(screen.getByTestId('avatar')).toBeInTheDocument();
         expect(screen.getByTestId('smart-toy-icon')).toBeInTheDocument();
      });

      it('handles fallback text when key is not found', () => {
         mockTextResources.getText.mockImplementation((key: string) => key);

         render(<ChatHeader />);

         expect(screen.getByText('ChatHeader.assistantName')).toBeInTheDocument();
         expect(screen.getByText('ChatHeader.assistantDescription')).toBeInTheDocument();
         
         const avatar = screen.getByTestId('avatar');
         expect(avatar).toHaveAttribute('aria-label', 'ChatHeader.avatarAlt');
      });
   });

   describe('Component structure', () => {
      it('has proper HTML structure', () => {
         render(<ChatHeader />);

         const header = document.querySelector('.ChatHeader');
         const avatar = screen.getByTestId('avatar');
         const assistantInfo = document.querySelector('.assistant-info');
         const assistantName = screen.getByRole('heading', { level: 2 });
         const assistantDescription = document.querySelector('.assistant-description');

         expect(header).toContainElement(avatar);
         expect(header).toContainElement(assistantInfo as HTMLElement);
         expect(assistantInfo).toContainElement(assistantName);
         expect(assistantInfo).toContainElement(assistantDescription as HTMLElement);
      });

      it('maintains proper element hierarchy', () => {
         render(<ChatHeader />);

         const header = document.querySelector('.ChatHeader');
         expect(header?.children).toHaveLength(2); // Avatar and assistant-info

         const assistantInfo = document.querySelector('.assistant-info');
         expect(assistantInfo?.children).toHaveLength(2); // Name and description
      });
   });

   describe('Accessibility', () => {
      it('has proper semantic HTML structure', () => {
         render(<ChatHeader />);

         // Should have heading
         const heading = screen.getByRole('heading', { level: 2 });
         expect(heading).toBeInTheDocument();

         // Should have avatar with proper alt text
         const avatar = screen.getByRole('img');
         expect(avatar).toBeInTheDocument();
         expect(avatar).toHaveAttribute('aria-label', 'AI Assistant Avatar');
      });

      it('provides accessible content for screen readers', () => {
         render(<ChatHeader />);

         // Heading should be accessible
         const heading = screen.getByRole('heading', { name: 'AI Assistant' });
         expect(heading).toBeInTheDocument();

         // Avatar should have proper alt text
         const avatar = screen.getByRole('img', { name: 'AI Assistant Avatar' });
         expect(avatar).toBeInTheDocument();
      });
   });

   describe('Visual elements', () => {
      it('contains the SmartToy icon within the avatar', () => {
         render(<ChatHeader />);

         const avatar = screen.getByTestId('avatar');
         const icon = screen.getByTestId('smart-toy-icon');
         
         expect(avatar).toContainElement(icon);
      });

      it('applies correct CSS classes to all elements', () => {
         render(<ChatHeader />);

         expect(document.querySelector('.ChatHeader')).toBeInTheDocument();
         expect(document.querySelector('.assistant-avatar')).toBeInTheDocument();
         expect(document.querySelector('.assistant-info')).toBeInTheDocument();
         expect(document.querySelector('.assistant-name')).toBeInTheDocument();
         expect(document.querySelector('.assistant-description')).toBeInTheDocument();
      });
   });

   describe('Edge cases', () => {
      it('handles extremely long assistant names', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            if (key === 'ChatHeader.assistantName') {
               return 'This is an extremely long assistant name that might cause layout issues in some scenarios';
            }
            return key === 'ChatHeader.assistantDescription' 
               ? 'Short description' 
               : key;
         });

         render(<ChatHeader />);

         const longName = screen.getByText('This is an extremely long assistant name that might cause layout issues in some scenarios');
         expect(longName).toBeInTheDocument();
         expect(longName).toHaveClass('assistant-name');
      });

      it('handles extremely long descriptions', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            if (key === 'ChatHeader.assistantDescription') {
               return 'This is an extremely long description that contains a lot of information about the AI assistant and its capabilities, which might span multiple lines and test the component\'s ability to handle lengthy content gracefully without breaking the layout or causing accessibility issues.';
            }
            return key === 'ChatHeader.assistantName' 
               ? 'AI Assistant' 
               : key;
         });

         render(<ChatHeader />);

         const longDescription = screen.getByText(/This is an extremely long description/);
         expect(longDescription).toBeInTheDocument();
         expect(longDescription).toHaveClass('assistant-description');
      });

      it('handles special characters in text', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const specialTexts: Record<string, string> = {
               'ChatHeader.assistantName': 'AI Assistant™ & Co.',
               'ChatHeader.assistantDescription': 'Specialized AI with <special> characters & symbols!',
               'ChatHeader.avatarAlt': 'AI Assistant™ Avatar'
            };
            return specialTexts[key] || key;
         });

         render(<ChatHeader />);

         expect(screen.getByText('AI Assistant™ & Co.')).toBeInTheDocument();
         expect(screen.getByText('Specialized AI with <special> characters & symbols!')).toBeInTheDocument();
         
         const avatar = screen.getByTestId('avatar');
         expect(avatar).toHaveAttribute('aria-label', 'AI Assistant™ Avatar');
      });
   });
});

