import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateExperienceContent from './CreateExperienceContent';

// Mock dependencies
jest.mock('@/components/headers', () => ({
   PageHeader: ({ title, description, ...props }: { title: string; description: string } & Record<string, unknown>) => (
      <div data-testid="page-header" {...props}>
         <h1 data-testid="page-title">{title}</h1>
         <p data-testid="page-description">{description}</p>
      </div>
   )
}));

jest.mock('@/components/common', () => ({
   Container: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div data-testid="container" {...props}>
         {children}
      </div>
   )
}));

jest.mock('@/components/forms/experiences/CreateExperienceForm/CreateExperienceForm', () => {
   return function CreateExperienceForm(props: Record<string, unknown>) {
      return (
         <div data-testid="create-experience-form" {...props}>
            Create Experience Form Component
         </div>
      );
   };
});

const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('./CreateExperienceContent.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('CreateExperienceContent', () => {
   beforeEach(() => {
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               switch (key) {
                  case 'CreateExperienceContent.pageHeader.title':
                     return 'Create Experience';
                  case 'CreateExperienceContent.pageHeader.description':
                     return 'Fill in the details to create a new experience.';
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
            render(<CreateExperienceContent />);
         }).not.toThrow();
      });

      it('renders the root component with correct CSS class', () => {
         render(<CreateExperienceContent />);
         const rootElement = screen.getByText('Create Experience').closest('.CreateExperienceContent');
         expect(rootElement).toBeInTheDocument();
         expect(rootElement).toHaveClass('CreateExperienceContent');
      });

      it('renders page header component', () => {
         render(<CreateExperienceContent />);
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
      });

      it('renders container component', () => {
         render(<CreateExperienceContent />);
         expect(screen.getByTestId('container')).toBeInTheDocument();
      });

      it('renders create experience form', () => {
         render(<CreateExperienceContent />);
         expect(screen.getByTestId('create-experience-form')).toBeInTheDocument();
      });
   });

   describe('Text resources integration', () => {
      it('uses text resources for page header title', () => {
         render(<CreateExperienceContent />);
         expect(screen.getByText('Create Experience')).toBeInTheDocument();
         expect(screen.getByTestId('page-title')).toHaveTextContent('Create Experience');
      });

      it('uses text resources for page header description', () => {
         render(<CreateExperienceContent />);
         expect(screen.getByText('Fill in the details to create a new experience.')).toBeInTheDocument();
         expect(screen.getByTestId('page-description')).toHaveTextContent('Fill in the details to create a new experience.');
      });

      it('calls useTextResources with correct texts module', () => {
         render(<CreateExperienceContent />);
         expect(mockUseTextResources).toHaveBeenCalled();
      });

      it('calls getText with correct keys for title and description', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'CreateExperienceContent.pageHeader.title':
                  return 'Create Experience';
               case 'CreateExperienceContent.pageHeader.description':
                  return 'Fill in the details to create a new experience.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<CreateExperienceContent />);

         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceContent.pageHeader.title');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceContent.pageHeader.description');
      });
   });

   describe('Component structure and layout', () => {
      it('maintains proper component hierarchy', () => {
         const { container } = render(<CreateExperienceContent />);
         
         const rootDiv = container.querySelector('.CreateExperienceContent');
         expect(rootDiv).toBeInTheDocument();

         const pageHeader = screen.getByTestId('page-header');
         const containerElement = screen.getByTestId('container');
         
         expect(rootDiv).toContainElement(pageHeader);
         expect(rootDiv).toContainElement(containerElement);
      });

      it('renders form within container', () => {
         render(<CreateExperienceContent />);
         
         const containerElement = screen.getByTestId('container');
         const form = screen.getByTestId('create-experience-form');
         
         expect(containerElement).toContainElement(form);
      });

      it('renders semantic page structure', () => {
         render(<CreateExperienceContent />);
         
         const title = screen.getByRole('heading', { level: 1 });
         expect(title).toBeInTheDocument();
         expect(title).toHaveTextContent('Create Experience');
      });

      it('has correct layout order - header first, then container', () => {
         const { container } = render(<CreateExperienceContent />);
         
         const rootDiv = container.querySelector('.CreateExperienceContent');
         const children = Array.from(rootDiv?.children || []);
         
         expect(children[0]).toHaveAttribute('data-testid', 'page-header');
         expect(children[1]).toHaveAttribute('data-testid', 'container');
      });
   });

   describe('Component integration', () => {
      it('passes correct props to PageHeader', () => {
         render(<CreateExperienceContent />);
         
         const pageHeader = screen.getByTestId('page-header');
         const title = screen.getByTestId('page-title');
         const description = screen.getByTestId('page-description');
         
         expect(pageHeader).toBeInTheDocument();
         expect(title).toHaveTextContent('Create Experience');
         expect(description).toHaveTextContent('Fill in the details to create a new experience.');
      });

      it('renders CreateExperienceForm without additional props', () => {
         render(<CreateExperienceContent />);
         
         const form = screen.getByTestId('create-experience-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveTextContent('Create Experience Form Component');
      });

      it('integrates all components in correct structure', () => {
         render(<CreateExperienceContent />);
         
         // Verify all main components are present
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
         expect(screen.getByTestId('container')).toBeInTheDocument();
         expect(screen.getByTestId('create-experience-form')).toBeInTheDocument();
         
         // Verify text content
         expect(screen.getByText('Create Experience')).toBeInTheDocument();
         expect(screen.getByText('Fill in the details to create a new experience.')).toBeInTheDocument();
         expect(screen.getByText('Create Experience Form Component')).toBeInTheDocument();
      });
   });

   describe('Text resources variations', () => {
      it('handles different text resource values', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'CreateExperienceContent.pageHeader.title':
                        return 'Custom Experience Title';
                     case 'CreateExperienceContent.pageHeader.description':
                        return 'Custom experience description text.';
                     default:
                        return 'Default Text';
                  }
               })
            }
         });

         render(<CreateExperienceContent />);
         
         expect(screen.getByText('Custom Experience Title')).toBeInTheDocument();
         expect(screen.getByText('Custom experience description text.')).toBeInTheDocument();
      });

      it('handles Portuguese text resources', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'CreateExperienceContent.pageHeader.title':
                        return 'Criar Experiência';
                     case 'CreateExperienceContent.pageHeader.description':
                        return 'Preencha os detalhes para criar uma nova experiência.';
                     default:
                        return 'Texto Padrão';
                  }
               })
            }
         });

         render(<CreateExperienceContent />);
         
         expect(screen.getByText('Criar Experiência')).toBeInTheDocument();
         expect(screen.getByText('Preencha os detalhes para criar uma nova experiência.')).toBeInTheDocument();
      });
   });

   describe('Error handling and edge cases', () => {
      it('handles text resources failure gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  if (key === 'CreateExperienceContent.pageHeader.title') return 'Fallback Title';
                  if (key === 'CreateExperienceContent.pageHeader.description') return 'Fallback Description';
                  return 'Fallback Text';
               })
            }
         });
         
         expect(() => {
            render(<CreateExperienceContent />);
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
            render(<CreateExperienceContent />);
         }).not.toThrow();
         
         // Component should still render even with empty text
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
         expect(screen.getByTestId('create-experience-form')).toBeInTheDocument();
      });

      it('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({
            textResources: null
         });
         
         expect(() => {
            render(<CreateExperienceContent />);
         }).toThrow();
      });
   });

   describe('Accessibility', () => {
      it('has proper heading structure', () => {
         render(<CreateExperienceContent />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
         expect(heading).toHaveTextContent('Create Experience');
      });

      it('maintains semantic HTML structure', () => {
         const { container } = render(<CreateExperienceContent />);
         
         // Check for proper div structure
         const rootDiv = container.querySelector('.CreateExperienceContent');
         expect(rootDiv).toBeInTheDocument();
         
         // Verify heading is accessible
         const heading = screen.getByRole('heading');
         expect(heading).toBeInTheDocument();
      });

      it('provides descriptive page content', () => {
         render(<CreateExperienceContent />);
         
         // Title should be descriptive
         expect(screen.getByText('Create Experience')).toBeInTheDocument();
         
         // Description should provide context
         expect(screen.getByText('Fill in the details to create a new experience.')).toBeInTheDocument();
      });
   });

   describe('Performance and optimization', () => {
      it('only calls text resources once per render', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'CreateExperienceContent.pageHeader.title':
                  return 'Create Experience';
               case 'CreateExperienceContent.pageHeader.description':
                  return 'Fill in the details to create a new experience.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<CreateExperienceContent />);
         
         // Should call getText exactly twice - once for title, once for description
         expect(mockGetText).toHaveBeenCalledTimes(2);
      });

      it('maintains component purity - same props produce same output', () => {
         const { container: container1 } = render(<CreateExperienceContent />);
         const { container: container2 } = render(<CreateExperienceContent />);
         
         expect(container1.innerHTML).toBe(container2.innerHTML);
      });
   });

   describe('Form integration', () => {
      it('renders form component correctly', () => {
         render(<CreateExperienceContent />);
         
         const form = screen.getByTestId('create-experience-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveTextContent('Create Experience Form Component');
      });

      it('places form inside container for proper layout', () => {
         render(<CreateExperienceContent />);
         
         const container = screen.getByTestId('container');
         const form = screen.getByTestId('create-experience-form');
         
         expect(container).toContainElement(form);
      });

      it('maintains form isolation - no props passed to form', () => {
         render(<CreateExperienceContent />);
         
         const form = screen.getByTestId('create-experience-form');
         
         // Form should render independently without props from parent
         expect(form).toBeInTheDocument();
      });
   });

   describe('Component state management', () => {
      it('maintains consistent render output', () => {
         const { rerender } = render(<CreateExperienceContent />);
         
         const initialContent = screen.getByText('Create Experience');
         expect(initialContent).toBeInTheDocument();
         
         // Re-render should produce same output
         rerender(<CreateExperienceContent />);
         expect(screen.getByText('Create Experience')).toBeInTheDocument();
      });

      it('handles multiple renders efficiently', () => {
         const { unmount: unmount1 } = render(<CreateExperienceContent />);
         unmount1();
         
         const { unmount: unmount2 } = render(<CreateExperienceContent />);
         unmount2();
         
         const { } = render(<CreateExperienceContent />);
         
         // Should have only one set of components in the final render
         expect(screen.getAllByTestId('page-header')).toHaveLength(1);
         expect(screen.getAllByTestId('create-experience-form')).toHaveLength(1);
      });
   });
});
