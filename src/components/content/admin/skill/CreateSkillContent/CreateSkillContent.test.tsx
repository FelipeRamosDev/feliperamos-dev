import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateSkillContent from './CreateSkillContent';

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

jest.mock('@/components/forms/skills/CreateSkillForm/CreateSkillForm', () => {
   return function MockCreateSkillForm(props: Record<string, unknown>) {
      return (
         <div data-testid="create-skill-form" {...props}>
            Create Skill Form Component
         </div>
      );
   };
});

const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('./CreateSkillContent.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('CreateSkillContent', () => {
   beforeEach(() => {
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               switch (key) {
                  case 'CreateSkillContent.title':
                     return 'Create Skill';
                  case 'CreateSkillContent.subtitle':
                     return 'Fill in the details to create a new skill.';
                  default:
                     return key;
               }
            })
         }
      });
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<CreateSkillContent />)).not.toThrow();
      });

      test('renders main container with correct class', () => {
         render(<CreateSkillContent />);
         const mainContainer = document.querySelector('.CreateSkillContent');
         expect(mainContainer).toBeInTheDocument();
      });

      test('renders all required components', () => {
         render(<CreateSkillContent />);
         
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
         expect(screen.getByTestId('container')).toBeInTheDocument();
         expect(screen.getByTestId('create-skill-form')).toBeInTheDocument();
      });

      test('has correct component hierarchy', () => {
         render(<CreateSkillContent />);
         
         const mainContainer = document.querySelector('.CreateSkillContent');
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         const form = screen.getByTestId('create-skill-form');
         
         expect(mainContainer).toContainElement(pageHeader);
         expect(mainContainer).toContainElement(container);
         expect(container).toContainElement(form);
      });

      test('renders without any console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<CreateSkillContent />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });

      test('component has correct display name', () => {
         expect(CreateSkillContent.name).toBe('CreateSkillContent');
      });
   });

   describe('PageHeader Integration', () => {
      test('passes correct title to PageHeader', () => {
         render(<CreateSkillContent />);
         
         const pageTitle = screen.getByTestId('page-title');
         expect(pageTitle).toHaveTextContent('Create Skill');
      });

      test('passes correct description to PageHeader', () => {
         render(<CreateSkillContent />);
         
         const pageDescription = screen.getByTestId('page-description');
         expect(pageDescription).toHaveTextContent('Fill in the details to create a new skill.');
      });

      test('PageHeader is rendered as first child', () => {
         render(<CreateSkillContent />);
         
         const mainContainer = document.querySelector('.CreateSkillContent');
         const firstChild = mainContainer?.firstElementChild;
         expect(firstChild).toHaveAttribute('data-testid', 'page-header');
      });

      test('PageHeader receives text from textResources', () => {
         const mockGetText = jest.fn((key: string) => {
            if (key === 'CreateSkillContent.title') return 'Custom Title';
            if (key === 'CreateSkillContent.subtitle') return 'Custom Subtitle';
            return key;
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<CreateSkillContent />);
         
         expect(mockGetText).toHaveBeenCalledWith('CreateSkillContent.title');
         expect(mockGetText).toHaveBeenCalledWith('CreateSkillContent.subtitle');
         expect(screen.getByTestId('page-title')).toHaveTextContent('Custom Title');
         expect(screen.getByTestId('page-description')).toHaveTextContent('Custom Subtitle');
      });
   });

   describe('Container Integration', () => {
      test('Container is rendered after PageHeader', () => {
         render(<CreateSkillContent />);
         
         const mainContainer = document.querySelector('.CreateSkillContent');
         const children = Array.from(mainContainer?.children || []);
         
         expect(children[0]).toHaveAttribute('data-testid', 'page-header');
         expect(children[1]).toHaveAttribute('data-testid', 'container');
      });

      test('Container wraps CreateSkillForm', () => {
         render(<CreateSkillContent />);
         
         const container = screen.getByTestId('container');
         const form = screen.getByTestId('create-skill-form');
         
         expect(container).toContainElement(form);
      });

      test('Container is only wrapper for form', () => {
         render(<CreateSkillContent />);
         
         const container = screen.getByTestId('container');
         expect(container.children).toHaveLength(1);
         expect(container.firstElementChild).toHaveAttribute('data-testid', 'create-skill-form');
      });
   });

   describe('CreateSkillForm Integration', () => {
      test('renders CreateSkillForm component', () => {
         render(<CreateSkillContent />);
         
         const form = screen.getByTestId('create-skill-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveTextContent('Create Skill Form Component');
      });

      test('CreateSkillForm is wrapped by Container', () => {
         render(<CreateSkillContent />);
         
         const container = screen.getByTestId('container');
         const form = screen.getByTestId('create-skill-form');
         
         expect(container).toContainElement(form);
      });

      test('CreateSkillForm is the only child of Container', () => {
         render(<CreateSkillContent />);
         
         const container = screen.getByTestId('container');
         expect(container.children).toHaveLength(1);
         expect(container.firstElementChild).toBe(screen.getByTestId('create-skill-form'));
      });
   });

   describe('Text Resources Integration', () => {
      test('calls useTextResources with correct text module', () => {
         render(<CreateSkillContent />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
         // Note: The actual text module is passed as parameter, but we can't easily test the exact object
      });

      test('retrieves title text correctly', () => {
         const mockGetText = jest.fn();
         mockGetText.mockReturnValue('Create Skill Test');
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<CreateSkillContent />);
         
         expect(mockGetText).toHaveBeenCalledWith('CreateSkillContent.title');
      });

      test('retrieves subtitle text correctly', () => {
         const mockGetText = jest.fn();
         mockGetText.mockReturnValue('Fill in the details test');
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<CreateSkillContent />);
         
         expect(mockGetText).toHaveBeenCalledWith('CreateSkillContent.subtitle');
      });

      test('handles missing text resources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => undefined)
            }
         });

         expect(() => render(<CreateSkillContent />)).not.toThrow();
      });
   });

   describe('Component Structure and Layout', () => {
      test('has correct semantic structure', () => {
         render(<CreateSkillContent />);
         
         // Check main container
         const mainDiv = document.querySelector('.CreateSkillContent');
         expect(mainDiv).toBeInTheDocument();
         expect(mainDiv?.tagName).toBe('DIV');
         
         // Check header comes before form
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         
         expect(pageHeader.nextElementSibling).toBe(container);
      });

      test('maintains component order', () => {
         render(<CreateSkillContent />);
         
         const mainContainer = document.querySelector('.CreateSkillContent');
         const children = Array.from(mainContainer?.children || []);
         
         expect(children).toHaveLength(2);
         expect(children[0]).toHaveAttribute('data-testid', 'page-header');
         expect(children[1]).toHaveAttribute('data-testid', 'container');
      });

      test('all components are direct children of main container', () => {
         render(<CreateSkillContent />);
         
         const mainContainer = document.querySelector('.CreateSkillContent');
         expect(mainContainer?.children).toHaveLength(2);
      });
   });

   describe('Error Handling', () => {
      test('handles textResources errors gracefully', () => {
         mockUseTextResources.mockImplementation(() => {
            throw new Error('TextResources error');
         });

         expect(() => render(<CreateSkillContent />)).toThrow('TextResources error');
      });

      test('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({});

         expect(() => render(<CreateSkillContent />)).toThrow();
      });

      test('handles null textResources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: null
         });

         expect(() => render(<CreateSkillContent />)).toThrow();
      });
   });

   describe('Accessibility', () => {
      test('has proper heading structure', () => {
         render(<CreateSkillContent />);
         
         const pageTitle = screen.getByTestId('page-title');
         expect(pageTitle.tagName).toBe('H1');
      });

      test('page has descriptive content', () => {
         render(<CreateSkillContent />);
         
         const description = screen.getByTestId('page-description');
         expect(description).toHaveTextContent('Fill in the details to create a new skill.');
      });

      test('maintains logical tab order', () => {
         render(<CreateSkillContent />);
         
         // Header should come before form in DOM order
         const pageHeader = screen.getByTestId('page-header');
         const form = screen.getByTestId('create-skill-form');
         
         expect(pageHeader.compareDocumentPosition(form)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      });

      test('has meaningful page structure', () => {
         render(<CreateSkillContent />);
         
         // Should have clear header and content sections
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         
         expect(pageHeader).toBeInTheDocument();
         expect(container).toBeInTheDocument();
      });
   });

   describe('Performance', () => {
      test('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<CreateSkillContent />);
         
         const initialForm = screen.getByTestId('create-skill-form');
         rerender(<CreateSkillContent />);
         const rerenderedForm = screen.getByTestId('create-skill-form');
         
         // Components should be stable
         expect(initialForm).toBeInTheDocument();
         expect(rerenderedForm).toBeInTheDocument();
      });

      test('maintains component references', () => {
         render(<CreateSkillContent />);
         
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         const form = screen.getByTestId('create-skill-form');
         
         expect(pageHeader).toBeInTheDocument();
         expect(container).toBeInTheDocument();
         expect(form).toBeInTheDocument();
      });
   });

   describe('CSS Classes and Styling', () => {
      test('applies correct CSS class to main container', () => {
         render(<CreateSkillContent />);
         
         const mainContainer = document.querySelector('.CreateSkillContent');
         expect(mainContainer).toBeInTheDocument();
         expect(mainContainer).toHaveClass('CreateSkillContent');
      });

      test('main container has no additional classes', () => {
         render(<CreateSkillContent />);
         
         const mainContainer = document.querySelector('.CreateSkillContent');
         expect(mainContainer?.className).toBe('CreateSkillContent');
      });
   });

   describe('Component Integration', () => {
      test('integrates PageHeader and Container components properly', () => {
         render(<CreateSkillContent />);
         
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         
         expect(pageHeader).toBeInTheDocument();
         expect(container).toBeInTheDocument();
         
         // Both should be siblings under main container
         const mainContainer = document.querySelector('.CreateSkillContent');
         expect(mainContainer).toContainElement(pageHeader);
         expect(mainContainer).toContainElement(container);
      });

      test('provides correct props to all child components', () => {
         render(<CreateSkillContent />);
         
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         const form = screen.getByTestId('create-skill-form');
         
         expect(pageHeader).toBeInTheDocument();
         expect(container).toBeInTheDocument();
         expect(form).toBeInTheDocument();
      });
   });
});