import { render, screen } from '@testing-library/react';
import React from 'react';
import BasicFooter from './BasicFooter';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

interface ContainerProps {
   children: React.ReactNode;
}

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

// Mock Container component
jest.mock('@/components/common', () => ({
   Container: ({ children }: ContainerProps) => (
      <div data-testid="container">
         {children}
      </div>
   )
}));

describe('BasicFooter', () => {
   let mockTextResources: {
      getText: jest.Mock;
   };

   beforeEach(() => {
      mockTextResources = {
         getText: jest.fn()
      };

      (useTextResources as jest.Mock).mockReturnValue({
         textResources: mockTextResources
      });

      // Set up default text resource response
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'BasicFooter.copyright': '© 2025 Ramos Desenvolvimento de Softwares Ltda. | CNPJ 61.440.162/0001-35'
         };
         return texts[key] || key;
      });

      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders the BasicFooter element', () => {
         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         expect(footer).toBeInTheDocument();
         expect(footer).toHaveClass('BasicFooter');
      });

      it('renders as a footer element', () => {
         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         expect(footer.tagName).toBe('FOOTER');
      });

      it('renders with Container component', () => {
         render(<BasicFooter />);

         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
      });

      it('renders copyright text', () => {
         render(<BasicFooter />);

         const copyrightText = screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i);
         expect(copyrightText).toBeInTheDocument();
         expect(copyrightText).toHaveClass('company-info');
      });

      it('renders copyright text in a paragraph element', () => {
         render(<BasicFooter />);

         const copyrightParagraph = screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i);
         expect(copyrightParagraph.tagName).toBe('P');
      });
   });

   describe('TextResources integration', () => {
      it('uses TextResources with basicFooterText', () => {
         render(<BasicFooter />);

         expect(useTextResources).toHaveBeenCalledWith(expect.any(Object));
         expect(useTextResources).toHaveBeenCalledTimes(1);
      });

      it('retrieves copyright text from TextResources', () => {
         render(<BasicFooter />);

         expect(mockTextResources.getText).toHaveBeenCalledWith('BasicFooter.copyright');
         expect(mockTextResources.getText).toHaveBeenCalledTimes(1);
      });

      it('displays the copyright text from TextResources', () => {
         render(<BasicFooter />);

         const copyrightText = screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i);
         expect(copyrightText).toBeInTheDocument();
         expect(copyrightText).toHaveTextContent('© 2025 Ramos Desenvolvimento de Softwares Ltda. | CNPJ 61.440.162/0001-35');
      });

      it('handles custom copyright text from TextResources', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            if (key === 'BasicFooter.copyright') {
               return '© 2025 Custom Company Name | Custom CNPJ';
            }
            return key;
         });

         render(<BasicFooter />);

         const copyrightText = screen.getByText(/© 2025 Custom Company Name/i);
         expect(copyrightText).toBeInTheDocument();
         expect(copyrightText).toHaveTextContent('© 2025 Custom Company Name | Custom CNPJ');
      });

      it('handles empty text resources gracefully', () => {
         mockTextResources.getText.mockReturnValue('');

         render(<BasicFooter />);

         // Footer should still render even with empty text
         const footer = screen.getByRole('contentinfo');
         expect(footer).toBeInTheDocument();
         
         const paragraph = footer.querySelector('p');
         expect(paragraph).toBeInTheDocument();
         expect(paragraph).toHaveTextContent('');
      });

      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockReturnValue('BasicFooter.copyright');

         render(<BasicFooter />);

         // Footer should still render even with missing text
         const footer = screen.getByRole('contentinfo');
         expect(footer).toBeInTheDocument();
         
         const paragraph = screen.getByText('BasicFooter.copyright');
         expect(paragraph).toBeInTheDocument();
      });
   });

   describe('Component structure', () => {
      it('has correct HTML structure', () => {
         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         expect(footer).toHaveClass('BasicFooter');

         const container = screen.getByTestId('container');
         expect(footer).toContainElement(container);

         const paragraph = screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i);
         expect(container).toContainElement(paragraph);
      });

      it('maintains proper DOM hierarchy', () => {
         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         const container = screen.getByTestId('container');
         const paragraph = screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i);

         expect(footer.children).toHaveLength(1);
         expect(footer.children[0]).toBe(container);
         expect(container.children).toHaveLength(1);
         expect(container.children[0]).toBe(paragraph);
      });

      it('applies correct CSS classes', () => {
         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         expect(footer).toHaveClass('BasicFooter');

         const paragraph = screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i);
         expect(paragraph).toHaveClass('company-info');
      });
   });

   describe('Content validation', () => {
      it('displays company name correctly', () => {
         render(<BasicFooter />);

         const copyrightText = screen.getByText(/Ramos Desenvolvimento de Softwares Ltda/i);
         expect(copyrightText).toBeInTheDocument();
      });

      it('displays CNPJ correctly', () => {
         render(<BasicFooter />);

         const copyrightText = screen.getByText(/CNPJ 61.440.162\/0001-35/i);
         expect(copyrightText).toBeInTheDocument();
      });

      it('displays copyright year correctly', () => {
         render(<BasicFooter />);

         const copyrightText = screen.getByText(/© 2025/i);
         expect(copyrightText).toBeInTheDocument();
      });

      it('displays full copyright text correctly', () => {
         render(<BasicFooter />);

         const copyrightText = screen.getByText('© 2025 Ramos Desenvolvimento de Softwares Ltda. | CNPJ 61.440.162/0001-35');
         expect(copyrightText).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      it('uses semantic footer element', () => {
         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         expect(footer).toBeInTheDocument();
         expect(footer.tagName).toBe('FOOTER');
      });

      it('provides accessible copyright information', () => {
         render(<BasicFooter />);

         const copyrightText = screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i);
         expect(copyrightText).toBeInTheDocument();
         expect(copyrightText).toBeVisible();
      });

      it('has proper text content for screen readers', () => {
         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         expect(footer).toHaveTextContent('© 2025 Ramos Desenvolvimento de Softwares Ltda. | CNPJ 61.440.162/0001-35');
      });

      it('maintains proper document structure', () => {
         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         const paragraph = footer.querySelector('p');
         
         expect(paragraph).toBeInTheDocument();
         expect(paragraph).toHaveTextContent('© 2025 Ramos Desenvolvimento de Softwares Ltda. | CNPJ 61.440.162/0001-35');
      });
   });

   describe('Component behavior', () => {
      it('renders consistently', () => {
         const { rerender } = render(<BasicFooter />);

         // Initial render
         expect(screen.getByRole('contentinfo')).toBeInTheDocument();
         expect(screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i)).toBeInTheDocument();

         // Re-render should maintain same content
         rerender(<BasicFooter />);

         expect(screen.getByRole('contentinfo')).toBeInTheDocument();
         expect(screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i)).toBeInTheDocument();
      });

      it('handles re-renders without issues', () => {
         const { rerender } = render(<BasicFooter />);

         expect(mockTextResources.getText).toHaveBeenCalledTimes(1);

         rerender(<BasicFooter />);

         expect(mockTextResources.getText).toHaveBeenCalledTimes(2);
         expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      });

      it('maintains component state', () => {
         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         const initialText = screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i);

         expect(footer).toBeInTheDocument();
         expect(initialText).toBeInTheDocument();
      });
   });

   describe('Error handling', () => {
      it('handles TextResources errors gracefully', () => {
         mockTextResources.getText.mockImplementation(() => {
            throw new Error('TextResources error');
         });

         expect(() => render(<BasicFooter />)).toThrow('TextResources error');
      });

      it('handles null TextResources gracefully', () => {
         mockTextResources.getText.mockReturnValue(null);

         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         expect(footer).toBeInTheDocument();
      });

      it('handles undefined TextResources gracefully', () => {
         mockTextResources.getText.mockReturnValue(undefined);

         render(<BasicFooter />);

         const footer = screen.getByRole('contentinfo');
         expect(footer).toBeInTheDocument();
      });
   });

   describe('Performance considerations', () => {
      it('renders efficiently', () => {
         const startTime = performance.now();
         render(<BasicFooter />);
         const endTime = performance.now();

         expect(screen.getByRole('contentinfo')).toBeInTheDocument();
         expect(endTime - startTime).toBeLessThan(50);
      });

      it('does not cause unnecessary re-renders', () => {
         const { rerender } = render(<BasicFooter />);

         expect(mockTextResources.getText).toHaveBeenCalledTimes(1);

         rerender(<BasicFooter />);

         expect(mockTextResources.getText).toHaveBeenCalledTimes(2);
      });

      it('maintains consistent performance', () => {
         const renderTimes: number[] = [];

         for (let i = 0; i < 5; i++) {
            const startTime = performance.now();
            const { unmount } = render(<BasicFooter />);
            const endTime = performance.now();
            renderTimes.push(endTime - startTime);
            unmount();
         }

         const avgTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
         expect(avgTime).toBeLessThan(100);
      });
   });

   describe('Integration with Container', () => {
      it('integrates properly with Container component', () => {
         render(<BasicFooter />);

         const container = screen.getByTestId('container');
         const paragraph = screen.getByText(/© 2025 Ramos Desenvolvimento de Softwares Ltda/i);

         expect(container).toBeInTheDocument();
         expect(container).toContainElement(paragraph);
      });

      it('passes children to Container correctly', () => {
         render(<BasicFooter />);

         const container = screen.getByTestId('container');
         expect(container.children).toHaveLength(1);
         expect(container.children[0]).toHaveClass('company-info');
      });
   });
});

