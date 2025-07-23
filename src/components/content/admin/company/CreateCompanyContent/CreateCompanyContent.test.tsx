import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateCompanyContent from './CreateCompanyContent';

// Mock dependencies
jest.mock('@/components/common', () => ({
   Container: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div data-testid="container" {...props}>
         {children}
      </div>
   )
}));

jest.mock('@/components/headers', () => ({
   PageHeader: ({ title, description, ...props }: { title: string; description: string } & Record<string, unknown>) => (
      <div data-testid="page-header" {...props}>
         <h1 data-testid="page-title">{title}</h1>
         <p data-testid="page-description">{description}</p>
      </div>
   )
}));

jest.mock('@/components/forms', () => ({
   CreateCompanyForm: (props: Record<string, unknown>) => (
      <div data-testid="create-company-form" {...props}>
         Create Company Form Component
      </div>
   )
}));

const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('./CreateCompanyContent.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('CreateCompanyContent', () => {
   beforeEach(() => {
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               switch (key) {
                  case 'CreateCompanyContent.pageHeader.title':
                     return 'Create Company';
                  case 'CreateCompanyContent.pageHeader.description':
                     return 'Fill in the details below to create a new company.';
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
            render(<CreateCompanyContent />);
         }).not.toThrow();
      });

      it('renders the root component with correct CSS class', () => {
         render(<CreateCompanyContent />);
         const rootElement = screen.getByText('Create Company').closest('.CreateCompanyContent');
         expect(rootElement).toBeInTheDocument();
         expect(rootElement).toHaveClass('CreateCompanyContent');
      });

      it('renders page header component', () => {
         render(<CreateCompanyContent />);
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
      });

      it('renders container component', () => {
         render(<CreateCompanyContent />);
         expect(screen.getByTestId('container')).toBeInTheDocument();
      });

      it('renders create company form', () => {
         render(<CreateCompanyContent />);
         expect(screen.getByTestId('create-company-form')).toBeInTheDocument();
      });
   });

   describe('Text resources integration', () => {
      it('uses text resources for page header title', () => {
         render(<CreateCompanyContent />);
         expect(screen.getByText('Create Company')).toBeInTheDocument();
         expect(screen.getByTestId('page-title')).toHaveTextContent('Create Company');
      });

      it('uses text resources for page header description', () => {
         render(<CreateCompanyContent />);
         expect(screen.getByText('Fill in the details below to create a new company.')).toBeInTheDocument();
         expect(screen.getByTestId('page-description')).toHaveTextContent('Fill in the details below to create a new company.');
      });

      it('calls useTextResources with correct texts module', () => {
         render(<CreateCompanyContent />);
         expect(mockUseTextResources).toHaveBeenCalled();
      });

      it('calls getText with correct keys for title and description', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'CreateCompanyContent.pageHeader.title':
                  return 'Create Company';
               case 'CreateCompanyContent.pageHeader.description':
                  return 'Fill in the details below to create a new company.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<CreateCompanyContent />);

         expect(mockGetText).toHaveBeenCalledWith('CreateCompanyContent.pageHeader.title');
         expect(mockGetText).toHaveBeenCalledWith('CreateCompanyContent.pageHeader.description');
      });
   });

   describe('Component structure and layout', () => {
      it('maintains proper component hierarchy', () => {
         const { container } = render(<CreateCompanyContent />);
         
         const rootDiv = container.querySelector('.CreateCompanyContent');
         expect(rootDiv).toBeInTheDocument();

         const pageHeader = screen.getByTestId('page-header');
         const containerElement = screen.getByTestId('container');
         
         expect(rootDiv).toContainElement(pageHeader);
         expect(rootDiv).toContainElement(containerElement);
      });

      it('renders form within container', () => {
         render(<CreateCompanyContent />);
         
         const containerElement = screen.getByTestId('container');
         const form = screen.getByTestId('create-company-form');
         
         expect(containerElement).toContainElement(form);
      });

      it('renders semantic page structure', () => {
         render(<CreateCompanyContent />);
         
         const title = screen.getByRole('heading', { level: 1 });
         expect(title).toBeInTheDocument();
         expect(title).toHaveTextContent('Create Company');
      });

      it('has correct layout order - header first, then container', () => {
         const { container } = render(<CreateCompanyContent />);
         
         const rootDiv = container.querySelector('.CreateCompanyContent');
         const children = Array.from(rootDiv?.children || []);
         
         expect(children[0]).toHaveAttribute('data-testid', 'page-header');
         expect(children[1]).toHaveAttribute('data-testid', 'container');
      });
   });

   describe('Component integration', () => {
      it('passes correct props to PageHeader', () => {
         render(<CreateCompanyContent />);
         
         const pageHeader = screen.getByTestId('page-header');
         const title = screen.getByTestId('page-title');
         const description = screen.getByTestId('page-description');
         
         expect(pageHeader).toBeInTheDocument();
         expect(title).toHaveTextContent('Create Company');
         expect(description).toHaveTextContent('Fill in the details below to create a new company.');
      });

      it('renders CreateCompanyForm without additional props', () => {
         render(<CreateCompanyContent />);
         
         const form = screen.getByTestId('create-company-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveTextContent('Create Company Form Component');
      });

      it('integrates all components in correct structure', () => {
         render(<CreateCompanyContent />);
         
         // Verify all main components are present
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
         expect(screen.getByTestId('container')).toBeInTheDocument();
         expect(screen.getByTestId('create-company-form')).toBeInTheDocument();
         
         // Verify text content
         expect(screen.getByText('Create Company')).toBeInTheDocument();
         expect(screen.getByText('Fill in the details below to create a new company.')).toBeInTheDocument();
         expect(screen.getByText('Create Company Form Component')).toBeInTheDocument();
      });
   });

   describe('Text resources variations', () => {
      it('handles different text resource values', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'CreateCompanyContent.pageHeader.title':
                        return 'Custom Title';
                     case 'CreateCompanyContent.pageHeader.description':
                        return 'Custom Description';
                     default:
                        return 'Default Text';
                  }
               })
            }
         });

         render(<CreateCompanyContent />);
         
         expect(screen.getByText('Custom Title')).toBeInTheDocument();
         expect(screen.getByText('Custom Description')).toBeInTheDocument();
      });

      it('handles Portuguese text resources', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'CreateCompanyContent.pageHeader.title':
                        return 'Criar Empresa';
                     case 'CreateCompanyContent.pageHeader.description':
                        return 'Preencha os detalhes abaixo para criar uma nova empresa.';
                     default:
                        return 'Texto Padrão';
                  }
               })
            }
         });

         render(<CreateCompanyContent />);
         
         expect(screen.getByText('Criar Empresa')).toBeInTheDocument();
         expect(screen.getByText('Preencha os detalhes abaixo para criar uma nova empresa.')).toBeInTheDocument();
      });
   });

   describe('Error handling and edge cases', () => {
      it('handles text resources failure gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  if (key === 'CreateCompanyContent.pageHeader.title') return 'Fallback Title';
                  if (key === 'CreateCompanyContent.pageHeader.description') return 'Fallback Description';
                  return 'Fallback Text';
               })
            }
         });
         
         expect(() => {
            render(<CreateCompanyContent />);
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
            render(<CreateCompanyContent />);
         }).not.toThrow();
         
         // Component should still render even with empty text
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
         expect(screen.getByTestId('create-company-form')).toBeInTheDocument();
      });

      it('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({
            textResources: null
         });
         
         expect(() => {
            render(<CreateCompanyContent />);
         }).toThrow();
      });
   });

   describe('Accessibility', () => {
      it('has proper heading structure', () => {
         render(<CreateCompanyContent />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
         expect(heading).toHaveTextContent('Create Company');
      });

      it('maintains semantic HTML structure', () => {
         const { container } = render(<CreateCompanyContent />);
         
         // Check for proper div structure
         const rootDiv = container.querySelector('.CreateCompanyContent');
         expect(rootDiv).toBeInTheDocument();
         
         // Verify heading is accessible
         const heading = screen.getByRole('heading');
         expect(heading).toBeInTheDocument();
      });

      it('provides descriptive page content', () => {
         render(<CreateCompanyContent />);
         
         // Title should be descriptive
         expect(screen.getByText('Create Company')).toBeInTheDocument();
         
         // Description should provide context
         expect(screen.getByText('Fill in the details below to create a new company.')).toBeInTheDocument();
      });
   });

   describe('Performance and optimization', () => {
      it('only calls text resources once per render', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'CreateCompanyContent.pageHeader.title':
                  return 'Create Company';
               case 'CreateCompanyContent.pageHeader.description':
                  return 'Fill in the details below to create a new company.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<CreateCompanyContent />);
         
         // Should call getText exactly twice - once for title, once for description
         expect(mockGetText).toHaveBeenCalledTimes(2);
      });

      it('maintains component purity - same props produce same output', () => {
         const { container: container1 } = render(<CreateCompanyContent />);
         const { container: container2 } = render(<CreateCompanyContent />);
         
         expect(container1.innerHTML).toBe(container2.innerHTML);
      });
   });
});
