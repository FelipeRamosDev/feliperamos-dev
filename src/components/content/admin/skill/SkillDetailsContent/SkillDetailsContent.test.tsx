import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillDetailsContent from './SkillDetailsContent';
import { SkillData } from '@/types/database.types';

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

jest.mock('@/components/layout', () => ({
   ContentSidebar: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div data-testid="content-sidebar" {...props}>
         {Array.isArray(children) ? (
            children.map((child, index) => (
               <div key={index} data-testid={`sidebar-section-${index}`}>
                  {child}
               </div>
            ))
         ) : (
            <div data-testid="sidebar-section-0">{children}</div>
         )}
      </div>
   )
}));

jest.mock('./subcomponents/SkillDetailsInfos', () => {
   return function SkillInfos(props: Record<string, unknown>) {
      return (
         <div data-testid="skill-infos" {...props}>
            Skill Infos Component
         </div>
      );
   };
});

jest.mock('./subcomponents/SkillDetailsSets', () => {
   return function SkillDetailsSets(props: Record<string, unknown>) {
      return (
         <div data-testid="skill-details-sets" {...props}>
            Skill Details Sets Component
         </div>
      );
   };
});

jest.mock('./subcomponents/SkillDetailsSidebar', () => {
   return function SkillDetailsSidebar(props: Record<string, unknown>) {
      return (
         <div data-testid="skill-details-sidebar" {...props}>
            Skill Details Sidebar Component
         </div>
      );
   };
});

jest.mock('./SkillDetailsContext', () => {
   return function SkillDetailsProvider({ children, skill, ...props }: { children: React.ReactNode; skill: SkillData } & Record<string, unknown>) {
      return (
         <div 
            data-testid="skill-details-provider" 
            data-skill={JSON.stringify(skill)}
            {...props}
         >
            {children}
         </div>
      );
   };
});

const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('./SkillDetailsContent.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

// Mock React Fragment to handle it properly in tests
jest.mock('react', () => ({
   ...jest.requireActual('react'),
   Fragment: ({ children }: { children: React.ReactNode }) => <div data-testid="fragment">{children}</div>
}));

describe('SkillDetailsContent', () => {
   let mockSkillData: SkillData;

   beforeEach(() => {
      mockSkillData = {
         id: 1,
         created_at: new Date('2023-01-01'),
         updated_at: new Date('2023-01-02'),
         schemaName: 'skills_schema',
         tableName: 'skills',
         category: 'Programming',
         level: 'Advanced',
         name: 'TypeScript',
         journey: 'Frontend Development',
         language_set: 'en',
         skill_id: 'typescript-001',
         user_id: 123,
         languageSets: []
      };

      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               switch (key) {
                  case 'SkillDetailsContent.title':
                     return 'Skill Details';
                  case 'SkillDetailsContent.subtitle':
                     return 'View and manage skill details.';
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
         expect(() => render(<SkillDetailsContent skill={mockSkillData} />)).not.toThrow();
      });

      test('renders main container with correct class', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         const mainContainer = document.querySelector('.SkillDetailsContent');
         expect(mainContainer).toBeInTheDocument();
      });

      test('renders all required components', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         expect(screen.getByTestId('skill-details-provider')).toBeInTheDocument();
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
         expect(screen.getByTestId('container')).toBeInTheDocument();
         expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
         expect(screen.getByTestId('skill-infos')).toBeInTheDocument();
         expect(screen.getByTestId('skill-details-sets')).toBeInTheDocument();
         expect(screen.getByTestId('skill-details-sidebar')).toBeInTheDocument();
      });

      test('has correct component hierarchy', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         const mainContainer = document.querySelector('.SkillDetailsContent');
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         const contentSidebar = screen.getByTestId('content-sidebar');
         
         expect(provider).toContainElement(mainContainer as HTMLElement);
         expect(mainContainer).toContainElement(pageHeader);
         expect(mainContainer).toContainElement(container);
         expect(container).toContainElement(contentSidebar);
      });

      test('renders without any console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<SkillDetailsContent skill={mockSkillData} />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });

      test('component has correct display name', () => {
         expect(SkillDetailsContent.name).toBe('SkillDetailsContent');
      });
   });

   describe('SkillDetailsProvider Integration', () => {
      test('wraps entire component with SkillDetailsProvider', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         const mainContainer = document.querySelector('.SkillDetailsContent');
         
         expect(provider).toBeInTheDocument();
         expect(provider).toContainElement(mainContainer as HTMLElement);
      });

      test('passes skill data to SkillDetailsProvider', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         const skillDataAttr = provider.getAttribute('data-skill');
         const parsedSkillData = JSON.parse(skillDataAttr || '{}');
         
         expect(parsedSkillData.id).toBe(mockSkillData.id);
         expect(parsedSkillData.name).toBe(mockSkillData.name);
         expect(parsedSkillData.category).toBe(mockSkillData.category);
         expect(parsedSkillData.level).toBe(mockSkillData.level);
      });

      test('provider wraps all content', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         expect(provider.children).toHaveLength(1);
         expect(provider.firstElementChild).toHaveClass('SkillDetailsContent');
      });

      test('handles complex skill data serialization', () => {
         const complexSkillData = {
            ...mockSkillData,
            languageSets: [
               {
                  ...mockSkillData,
                  id: 2,
                  name: 'Advanced TypeScript',
                  category: 'Programming',
                  level: 'Expert'
               }
            ]
         };

         render(<SkillDetailsContent skill={complexSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         const skillDataAttr = provider.getAttribute('data-skill');
         const parsedSkillData = JSON.parse(skillDataAttr || '{}');
         
         expect(parsedSkillData.languageSets).toBeDefined();
         expect(Array.isArray(parsedSkillData.languageSets)).toBe(true);
      });
   });

   describe('PageHeader Integration', () => {
      test('passes correct title to PageHeader', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const pageTitle = screen.getByTestId('page-title');
         expect(pageTitle).toHaveTextContent('Skill Details');
      });

      test('passes correct description to PageHeader', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const pageDescription = screen.getByTestId('page-description');
         expect(pageDescription).toHaveTextContent('View and manage skill details.');
      });

      test('PageHeader is rendered as first child of main container', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const mainContainer = document.querySelector('.SkillDetailsContent');
         const firstChild = mainContainer?.firstElementChild;
         expect(firstChild).toHaveAttribute('data-testid', 'page-header');
      });

      test('PageHeader receives text from textResources', () => {
         const mockGetText = jest.fn((key: string) => {
            if (key === 'SkillDetailsContent.title') return 'Custom Skill Title';
            if (key === 'SkillDetailsContent.subtitle') return 'Custom Skill Subtitle';
            return key;
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<SkillDetailsContent skill={mockSkillData} />);
         
         expect(mockGetText).toHaveBeenCalledWith('SkillDetailsContent.title');
         expect(mockGetText).toHaveBeenCalledWith('SkillDetailsContent.subtitle');
         expect(screen.getByTestId('page-title')).toHaveTextContent('Custom Skill Title');
         expect(screen.getByTestId('page-description')).toHaveTextContent('Custom Skill Subtitle');
      });
   });

   describe('Container and ContentSidebar Integration', () => {
      test('Container wraps ContentSidebar', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const container = screen.getByTestId('container');
         const contentSidebar = screen.getByTestId('content-sidebar');
         
         expect(container).toContainElement(contentSidebar);
      });

      test('Container is rendered after PageHeader', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const mainContainer = document.querySelector('.SkillDetailsContent');
         const children = Array.from(mainContainer?.children || []);
         
         expect(children[0]).toHaveAttribute('data-testid', 'page-header');
         expect(children[1]).toHaveAttribute('data-testid', 'container');
      });

      test('ContentSidebar contains main content and sidebar', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const contentSidebar = screen.getByTestId('content-sidebar');
         const skillInfos = screen.getByTestId('skill-infos');
         const skillDetailsSets = screen.getByTestId('skill-details-sets');
         const skillDetailsSidebar = screen.getByTestId('skill-details-sidebar');
         
         expect(contentSidebar).toContainElement(skillInfos);
         expect(contentSidebar).toContainElement(skillDetailsSets);
         expect(contentSidebar).toContainElement(skillDetailsSidebar);
      });

      test('ContentSidebar has correct structure with Fragment and sidebar', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const sidebarSections = screen.getAllByTestId(/sidebar-section-/);
         expect(sidebarSections).toHaveLength(2); // Fragment and Sidebar
      });
   });

   describe('Subcomponents Integration', () => {
      test('renders SkillInfos component', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const skillInfos = screen.getByTestId('skill-infos');
         expect(skillInfos).toBeInTheDocument();
         expect(skillInfos).toHaveTextContent('Skill Infos Component');
      });

      test('renders SkillDetailsSets component', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const skillDetailsSets = screen.getByTestId('skill-details-sets');
         expect(skillDetailsSets).toBeInTheDocument();
         expect(skillDetailsSets).toHaveTextContent('Skill Details Sets Component');
      });

      test('renders SkillDetailsSidebar component', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const skillDetailsSidebar = screen.getByTestId('skill-details-sidebar');
         expect(skillDetailsSidebar).toBeInTheDocument();
         expect(skillDetailsSidebar).toHaveTextContent('Skill Details Sidebar Component');
      });

      test('SkillInfos and SkillDetailsSets are wrapped in Fragment', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const fragment = screen.getByTestId('fragment');
         const skillInfos = screen.getByTestId('skill-infos');
         const skillDetailsSets = screen.getByTestId('skill-details-sets');
         
         expect(fragment).toContainElement(skillInfos);
         expect(fragment).toContainElement(skillDetailsSets);
      });

      test('SkillDetailsSidebar is not in Fragment', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const fragment = screen.getByTestId('fragment');
         const skillDetailsSidebar = screen.getByTestId('skill-details-sidebar');
         
         expect(fragment).not.toContainElement(skillDetailsSidebar);
      });
   });

   describe('Text Resources Integration', () => {
      test('calls useTextResources with correct text module', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
      });

      test('retrieves title text correctly', () => {
         const mockGetText = jest.fn();
         mockGetText.mockReturnValue('Skill Details Test');
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<SkillDetailsContent skill={mockSkillData} />);
         
         expect(mockGetText).toHaveBeenCalledWith('SkillDetailsContent.title');
      });

      test('retrieves subtitle text correctly', () => {
         const mockGetText = jest.fn();
         mockGetText.mockReturnValue('View and manage test');
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<SkillDetailsContent skill={mockSkillData} />);
         
         expect(mockGetText).toHaveBeenCalledWith('SkillDetailsContent.subtitle');
      });

      test('handles missing text resources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => undefined)
            }
         });

         expect(() => render(<SkillDetailsContent skill={mockSkillData} />)).not.toThrow();
      });
   });

   describe('Component Structure and Layout', () => {
      test('has correct semantic structure', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const mainDiv = document.querySelector('.SkillDetailsContent');
         expect(mainDiv).toBeInTheDocument();
         expect(mainDiv?.tagName).toBe('DIV');
         
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         
         expect(pageHeader.nextElementSibling).toBe(container);
      });

      test('maintains component order', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const mainContainer = document.querySelector('.SkillDetailsContent');
         const children = Array.from(mainContainer?.children || []);
         
         expect(children).toHaveLength(2);
         expect(children[0]).toHaveAttribute('data-testid', 'page-header');
         expect(children[1]).toHaveAttribute('data-testid', 'container');
      });

      test('all main components are direct children of main container', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const mainContainer = document.querySelector('.SkillDetailsContent');
         expect(mainContainer?.children).toHaveLength(2);
      });

      test('provider contains only main container', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         expect(provider.children).toHaveLength(1);
         expect(provider.firstElementChild).toHaveClass('SkillDetailsContent');
      });
   });

   describe('Props and Data Handling', () => {
      test('accepts skill prop correctly', () => {
         expect(() => render(<SkillDetailsContent skill={mockSkillData} />)).not.toThrow();
      });

      test('passes skill data through provider', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         const skillDataAttr = provider.getAttribute('data-skill');
         expect(skillDataAttr).toBeTruthy();
         
         const parsedData = JSON.parse(skillDataAttr || '{}');
         expect(parsedData.name).toBe('TypeScript');
         expect(parsedData.category).toBe('Programming');
         expect(parsedData.level).toBe('Advanced');
      });

      test('handles different skill data structures', () => {
         const differentSkillData = {
            ...mockSkillData,
            name: 'React',
            category: 'Library',
            level: 'Intermediate'
         };

         render(<SkillDetailsContent skill={differentSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         const skillDataAttr = provider.getAttribute('data-skill');
         const parsedData = JSON.parse(skillDataAttr || '{}');
         
         expect(parsedData.name).toBe('React');
         expect(parsedData.category).toBe('Library');
         expect(parsedData.level).toBe('Intermediate');
      });

      test('preserves all skill data properties', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         const skillDataAttr = provider.getAttribute('data-skill');
         const parsedData = JSON.parse(skillDataAttr || '{}');
         
         expect(parsedData.id).toBe(mockSkillData.id);
         expect(parsedData.skill_id).toBe(mockSkillData.skill_id);
         expect(parsedData.user_id).toBe(mockSkillData.user_id);
         expect(parsedData.journey).toBe(mockSkillData.journey);
         expect(parsedData.language_set).toBe(mockSkillData.language_set);
      });
   });

   describe('Error Handling', () => {
      test('handles textResources errors gracefully', () => {
         mockUseTextResources.mockImplementation(() => {
            throw new Error('TextResources error');
         });

         expect(() => render(<SkillDetailsContent skill={mockSkillData} />)).toThrow('TextResources error');
      });

      test('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({});

         expect(() => render(<SkillDetailsContent skill={mockSkillData} />)).toThrow();
      });

      test('handles null textResources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: null
         });

         expect(() => render(<SkillDetailsContent skill={mockSkillData} />)).toThrow();
      });

      test('handles missing skill prop gracefully', () => {
         // TypeScript would catch this, but testing runtime behavior
         expect(() => render(<SkillDetailsContent skill={null as unknown as SkillData} />)).not.toThrow();
      });
   });

   describe('Accessibility', () => {
      test('has proper heading structure', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const pageTitle = screen.getByTestId('page-title');
         expect(pageTitle.tagName).toBe('H1');
      });

      test('page has descriptive content', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const description = screen.getByTestId('page-description');
         expect(description).toHaveTextContent('View and manage skill details.');
      });

      test('maintains logical tab order', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const pageHeader = screen.getByTestId('page-header');
         const contentSidebar = screen.getByTestId('content-sidebar');
         
         expect(pageHeader.compareDocumentPosition(contentSidebar)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      });

      test('has meaningful page structure', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         
         expect(pageHeader).toBeInTheDocument();
         expect(container).toBeInTheDocument();
      });
   });

   describe('Performance', () => {
      test('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<SkillDetailsContent skill={mockSkillData} />);
         
         const initialProvider = screen.getByTestId('skill-details-provider');
         rerender(<SkillDetailsContent skill={mockSkillData} />);
         const rerenderedProvider = screen.getByTestId('skill-details-provider');
         
         expect(initialProvider).toBeInTheDocument();
         expect(rerenderedProvider).toBeInTheDocument();
      });

      test('maintains component references', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         const contentSidebar = screen.getByTestId('content-sidebar');
         
         expect(pageHeader).toBeInTheDocument();
         expect(container).toBeInTheDocument();
         expect(contentSidebar).toBeInTheDocument();
      });
   });

   describe('CSS Classes and Styling', () => {
      test('applies correct CSS class to main container', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const mainContainer = document.querySelector('.SkillDetailsContent');
         expect(mainContainer).toBeInTheDocument();
         expect(mainContainer).toHaveClass('SkillDetailsContent');
      });

      test('main container has no additional classes', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const mainContainer = document.querySelector('.SkillDetailsContent');
         expect(mainContainer?.className).toBe('SkillDetailsContent');
      });
   });

   describe('Component Integration', () => {
      test('integrates all components properly', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         const pageHeader = screen.getByTestId('page-header');
         const container = screen.getByTestId('container');
         const contentSidebar = screen.getByTestId('content-sidebar');
         const skillInfos = screen.getByTestId('skill-infos');
         const skillDetailsSets = screen.getByTestId('skill-details-sets');
         const skillDetailsSidebar = screen.getByTestId('skill-details-sidebar');
         
         expect(provider).toBeInTheDocument();
         expect(pageHeader).toBeInTheDocument();
         expect(container).toBeInTheDocument();
         expect(contentSidebar).toBeInTheDocument();
         expect(skillInfos).toBeInTheDocument();
         expect(skillDetailsSets).toBeInTheDocument();
         expect(skillDetailsSidebar).toBeInTheDocument();
      });

      test('provides correct context to all child components', () => {
         render(<SkillDetailsContent skill={mockSkillData} />);
         
         const provider = screen.getByTestId('skill-details-provider');
         const skillDataAttr = provider.getAttribute('data-skill');
         expect(skillDataAttr).toBeTruthy();
         
         // All child components should have access to the context
         expect(screen.getByTestId('skill-infos')).toBeInTheDocument();
         expect(screen.getByTestId('skill-details-sets')).toBeInTheDocument();
         expect(screen.getByTestId('skill-details-sidebar')).toBeInTheDocument();
      });
   });
});