import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginContent from './LoginContent';

// Mock dependencies
jest.mock('@/components/common', () => ({
   Card: ({ children, className, radius, padding, ...props }: { children: React.ReactNode; className?: string; radius?: string; padding?: string } & Record<string, unknown>) => (
      <div 
         data-testid="card" 
         className={className}
         data-radius={radius}
         data-padding={padding}
         {...props}
      >
         {children}
      </div>
   )
}));

jest.mock('@/components/forms', () => ({
   LoginForm: (props: { [key: string]: unknown }) => (
      <div data-testid="login-form" {...props}>
         Login Form Component
      </div>
   )
}));

jest.mock('@mui/icons-material/Lock', () => {
   return function LockIcon({ className, ...props }: { className?: string } & Record<string, unknown>) {
      return (
         <div 
            data-testid="lock-icon" 
            className={className}
            {...props}
         >
            🔒
         </div>
      );
   };
});

const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('./LoginContent.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('LoginContent', () => {
   beforeEach(() => {
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               switch (key) {
                  case 'LoginContent.title':
                     return 'Login';
                  case 'LoginContent.subtitle':
                     return 'Enter your credentials to access the admin area.';
                  default:
                     return 'Default Text';
               }
            })
         }
      });
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders without crashing', () => {
         expect(() => {
            render(<LoginContent />);
         }).not.toThrow();
      });

      it('renders the root component with correct CSS class', () => {
         render(<LoginContent />);
         const rootElement = screen.getByText('Login').closest('.LoginContent');
         expect(rootElement).toBeInTheDocument();
         expect(rootElement).toHaveClass('LoginContent');
      });

      it('renders card component', () => {
         render(<LoginContent />);
         expect(screen.getByTestId('card')).toBeInTheDocument();
      });

      it('renders login form', () => {
         render(<LoginContent />);
         expect(screen.getByTestId('login-form')).toBeInTheDocument();
      });

      it('renders login title with heading', () => {
         render(<LoginContent />);
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
         expect(heading).toHaveClass('login-title');
      });

      it('renders login description paragraph', () => {
         render(<LoginContent />);
         const description = screen.getByText('Enter your credentials to access the admin area.');
         expect(description).toBeInTheDocument();
         expect(description.tagName.toLowerCase()).toBe('p');
         expect(description).toHaveClass('login-description');
      });
   });

   describe('Card component integration', () => {
      it('renders card with correct CSS class', () => {
         render(<LoginContent />);
         const card = screen.getByTestId('card');
         expect(card).toHaveClass('login-card');
      });

      it('renders card with correct radius prop', () => {
         render(<LoginContent />);
         const card = screen.getByTestId('card');
         expect(card).toHaveAttribute('data-radius', 'm');
      });

      it('renders card with correct padding prop', () => {
         render(<LoginContent />);
         const card = screen.getByTestId('card');
         expect(card).toHaveAttribute('data-padding', 'l');
      });

      it('contains all content within card', () => {
         render(<LoginContent />);
         const card = screen.getByTestId('card');
         const title = screen.getByRole('heading');
         const description = screen.getByText('Enter your credentials to access the admin area.');
         const form = screen.getByTestId('login-form');

         expect(card).toContainElement(title);
         expect(card).toContainElement(description);
         expect(card).toContainElement(form);
      });
   });

   describe('Icon integration', () => {
      it('renders lock icon', () => {
         render(<LoginContent />);
         expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
      });

      it('renders lock icon with correct CSS class', () => {
         render(<LoginContent />);
         const icon = screen.getByTestId('lock-icon');
         expect(icon).toHaveClass('login-icon');
      });

      it('places icon within title heading', () => {
         render(<LoginContent />);
         const title = screen.getByRole('heading');
         const icon = screen.getByTestId('lock-icon');
         expect(title).toContainElement(icon);
      });

      it('displays icon content', () => {
         render(<LoginContent />);
         const icon = screen.getByTestId('lock-icon');
         expect(icon).toHaveTextContent('🔒');
      });
   });

   describe('Text resources integration', () => {
      it('uses text resources for title', () => {
         render(<LoginContent />);
         expect(screen.getByText('Login')).toBeInTheDocument();
         const heading = screen.getByRole('heading');
         expect(heading).toHaveTextContent('🔒Login');
      });

      it('uses text resources for subtitle', () => {
         render(<LoginContent />);
         expect(screen.getByText('Enter your credentials to access the admin area.')).toBeInTheDocument();
      });

      it('calls useTextResources with correct texts module', () => {
         render(<LoginContent />);
         expect(mockUseTextResources).toHaveBeenCalled();
      });

      it('calls getText with correct keys for title and subtitle', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'LoginContent.title':
                  return 'Login';
               case 'LoginContent.subtitle':
                  return 'Enter your credentials to access the admin area.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<LoginContent />);

         expect(mockGetText).toHaveBeenCalledWith('LoginContent.title');
         expect(mockGetText).toHaveBeenCalledWith('LoginContent.subtitle');
      });
   });

   describe('Component structure and layout', () => {
      it('maintains proper component hierarchy', () => {
         const { container } = render(<LoginContent />);
         
         const rootDiv = container.querySelector('.LoginContent') as HTMLElement;
         const card = screen.getByTestId('card');
         
         expect(rootDiv).toContainElement(card);
      });

      it('has correct layout order within card', () => {
         render(<LoginContent />);
         
         const card = screen.getByTestId('card');
         const children = Array.from(card.children);
         
         // First child should be h1 (title)
         expect(children[0].tagName.toLowerCase()).toBe('h1');
         expect(children[0]).toHaveClass('login-title');
         
         // Second child should be p (description)
         expect(children[1].tagName.toLowerCase()).toBe('p');
         expect(children[1]).toHaveClass('login-description');
         
         // Third child should be the form
         expect(children[2]).toHaveAttribute('data-testid', 'login-form');
      });

      it('renders semantic HTML structure', () => {
         render(<LoginContent />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
         expect(heading).toHaveTextContent('Login');
      });
   });

   describe('Form integration', () => {
      it('renders LoginForm component', () => {
         render(<LoginContent />);
         const form = screen.getByTestId('login-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveTextContent('Login Form Component');
      });

      it('places form at the bottom of the card', () => {
         render(<LoginContent />);
         
         const card = screen.getByTestId('card');
         const children = Array.from(card.children);
         const lastChild = children[children.length - 1];
         
         expect(lastChild).toHaveAttribute('data-testid', 'login-form');
      });

      it('renders form without additional props', () => {
         render(<LoginContent />);
         const form = screen.getByTestId('login-form');
         expect(form).toBeInTheDocument();
      });
   });

   describe('Text resources variations', () => {
      it('handles different text resource values', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'LoginContent.title':
                        return 'Custom Login Title';
                     case 'LoginContent.subtitle':
                        return 'Custom login description text.';
                     default:
                        return 'Default Text';
                  }
               })
            }
         });

         render(<LoginContent />);
         
         expect(screen.getByText('Custom Login Title')).toBeInTheDocument();
         expect(screen.getByText('Custom login description text.')).toBeInTheDocument();
      });

      it('handles Portuguese text resources', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'LoginContent.title':
                        return 'Login';
                     case 'LoginContent.subtitle':
                        return 'Insira suas credenciais para acessar a área administrativa.';
                     default:
                        return 'Texto Padrão';
                  }
               })
            }
         });

         render(<LoginContent />);
         
         expect(screen.getByText('Login')).toBeInTheDocument();
         expect(screen.getByText('Insira suas credenciais para acessar a área administrativa.')).toBeInTheDocument();
      });
   });

   describe('Error handling and edge cases', () => {
      it('handles text resources failure gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  if (key === 'LoginContent.title') return 'Fallback Title';
                  if (key === 'LoginContent.subtitle') return 'Fallback Description';
                  return 'Fallback Text';
               })
            }
         });
         
         expect(() => {
            render(<LoginContent />);
         }).not.toThrow();
         
         expect(screen.getByText('Fallback Title')).toBeInTheDocument();
         expect(screen.getByText('Fallback Description')).toBeInTheDocument();
      });

      it('handles empty text resources', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => '')
            }
         });
         
         expect(() => {
            render(<LoginContent />);
         }).not.toThrow();
         
         // Component should still render even with empty text
         expect(screen.getByTestId('card')).toBeInTheDocument();
         expect(screen.getByTestId('login-form')).toBeInTheDocument();
         expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
      });

      it('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({
            textResources: null
         });
         
         expect(() => {
            render(<LoginContent />);
         }).toThrow();
      });
   });

   describe('Accessibility', () => {
      it('has proper heading structure', () => {
         render(<LoginContent />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
         expect(heading).toHaveTextContent('Login');
      });

      it('maintains semantic HTML structure', () => {
         const { container } = render(<LoginContent />);
         
         // Check for proper heading
         const heading = screen.getByRole('heading');
         expect(heading).toBeInTheDocument();
         
         // Check for proper paragraph
         const paragraph = container.querySelector('p.login-description');
         expect(paragraph).toBeInTheDocument();
      });

      it('provides descriptive content', () => {
         render(<LoginContent />);
         
         // Title should be descriptive
         expect(screen.getByText('Login')).toBeInTheDocument();
         
         // Description should provide context
         expect(screen.getByText('Enter your credentials to access the admin area.')).toBeInTheDocument();
      });

      it('includes visual icon for better UX', () => {
         render(<LoginContent />);
         
         const icon = screen.getByTestId('lock-icon');
         expect(icon).toBeInTheDocument();
         expect(icon).toHaveTextContent('🔒');
      });
   });

   describe('Performance and optimization', () => {
      it('only calls text resources once per render', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'LoginContent.title':
                  return 'Login';
               case 'LoginContent.subtitle':
                  return 'Enter your credentials to access the admin area.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<LoginContent />);
         
         // Should call getText exactly twice - once for title, once for subtitle
         expect(mockGetText).toHaveBeenCalledTimes(2);
      });

      it('maintains component purity - same props produce same output', () => {
         const { container: container1 } = render(<LoginContent />);
         const { container: container2 } = render(<LoginContent />);
         
         expect(container1.innerHTML).toBe(container2.innerHTML);
      });
   });

   describe('CSS classes and styling', () => {
      it('applies correct CSS classes to all elements', () => {
         render(<LoginContent />);
         
         const rootDiv = screen.getByText('Login').closest('.LoginContent');
         const card = screen.getByTestId('card');
         const title = screen.getByRole('heading');
         const description = screen.getByText('Enter your credentials to access the admin area.');
         const icon = screen.getByTestId('lock-icon');
         
         expect(rootDiv).toHaveClass('LoginContent');
         expect(card).toHaveClass('login-card');
         expect(title).toHaveClass('login-title');
         expect(description).toHaveClass('login-description');
         expect(icon).toHaveClass('login-icon');
      });

      it('maintains consistent class naming convention', () => {
         render(<LoginContent />);
         
         // All classes should follow the kebab-case convention with 'login-' prefix
         const card = screen.getByTestId('card');
         const title = screen.getByRole('heading');
         const description = screen.getByText('Enter your credentials to access the admin area.');
         const icon = screen.getByTestId('lock-icon');
         
         expect(card.className).toMatch(/login-card/);
         expect(title.className).toMatch(/login-title/);
         expect(description.className).toMatch(/login-description/);
         expect(icon.className).toMatch(/login-icon/);
      });
   });

   describe('Component integration', () => {
      it('integrates all components correctly', () => {
         render(<LoginContent />);
         
         // Verify all main components are present
         expect(screen.getByTestId('card')).toBeInTheDocument();
         expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
         expect(screen.getByRole('heading')).toBeInTheDocument();
         expect(screen.getByTestId('login-form')).toBeInTheDocument();
         
         // Verify text content
         expect(screen.getByText('Login')).toBeInTheDocument();
         expect(screen.getByText('Enter your credentials to access the admin area.')).toBeInTheDocument();
         expect(screen.getByText('Login Form Component')).toBeInTheDocument();
      });

      it('maintains proper nesting structure', () => {
         render(<LoginContent />);
         
         const card = screen.getByTestId('card');
         const title = screen.getByRole('heading');
         const icon = screen.getByTestId('lock-icon');
         const description = screen.getByText('Enter your credentials to access the admin area.');
         const form = screen.getByTestId('login-form');
         
         // Card should contain title, description, and form
         expect(card).toContainElement(title);
         expect(card).toContainElement(description);
         expect(card).toContainElement(form);
         
         // Title should contain icon
         expect(title).toContainElement(icon);
      });
   });
});
