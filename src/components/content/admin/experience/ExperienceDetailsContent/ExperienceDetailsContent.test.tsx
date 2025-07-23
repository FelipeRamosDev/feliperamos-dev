import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExperienceDetailsContent from './ExperienceDetailsContent';
import { ExperienceData, CompanyData, SkillData } from '@/types/database.types';

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

jest.mock('./common/ExperienceDetailsSection', () => {
   return function ExperienceDetailsSection(props: Record<string, unknown>) {
      return (
         <div data-testid="experience-details-section" {...props}>
            Experience Details Section Component
         </div>
      );
   };
});

jest.mock('./common/ExperienceSetsSection', () => {
   return function ExperienceSetsSection(props: Record<string, unknown>) {
      return (
         <div data-testid="experience-sets-section" {...props}>
            Experience Sets Section Component
         </div>
      );
   };
});

jest.mock('./common/ExperienceDetailsSidebar', () => {
   return function ExperienceDetailsSidebar(props: Record<string, unknown>) {
      return (
         <div data-testid="experience-details-sidebar" {...props}>
            Experience Details Sidebar Component
         </div>
      );
   };
});

jest.mock('./ExperienceDetailsContext', () => {
   return function ExperienceDetailsProvider({ children, experience, ...props }: { children: React.ReactNode; experience: ExperienceData } & Record<string, unknown>) {
      return (
         <div 
            data-testid="experience-details-provider" 
            data-experience={JSON.stringify(experience)}
            {...props}
         >
            {children}
         </div>
      );
   };
});

jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn((className: string, moduleClass: string) => `${className} ${moduleClass}`)
}));

jest.mock('./ExperienceDetailsContent.module.scss', () => ({
   ExperienceDetailsContent: 'mock-experience-details-content-class'
}));

const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('./ExperienceDetailsContent.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('ExperienceDetailsContent', () => {
   const mockCompany: CompanyData = {
      id: 1,
      created_at: new Date('2023-01-01T00:00:00.000Z'),
      updated_at: new Date('2023-06-01T00:00:00.000Z'),
      schemaName: 'companies_schema',
      tableName: 'companies',
      company_id: 1,
      company_name: 'Test Company Inc.',
      location: 'San Francisco, CA',
      logo_url: 'https://example.com/logo.png',
      site_url: 'https://testcompany.com',
      description: 'A test company for unit testing',
      industry: 'Technology',
      language_set: 'en',
      languageSets: []
   };

   const mockSkills: SkillData[] = [
      {
         id: 1,
         created_at: new Date('2023-01-01T00:00:00.000Z'),
         schemaName: 'skills_schema',
         tableName: 'skills',
         skill_id: '1',
         name: 'JavaScript',
         language_set: 'en',
         category: 'Programming Language',
         level: 'advanced',
         journey: '',
         user_id: 0,
         languageSets: []
      }
   ];

   const mockExperience: ExperienceData = {
      id: 1,
      created_at: new Date('2023-01-01T00:00:00.000Z'),
      updated_at: new Date('2023-06-01T00:00:00.000Z'),
      schemaName: 'experiences_schema',
      tableName: 'experiences',
      company: mockCompany,
      company_id: 1,
      end_date: new Date('2023-12-31'),
      start_date: new Date('2023-01-01'),
      status: 'published' as const,
      type: 'full_time' as const,
      title: 'Senior Developer',
      position: 'Senior Frontend Developer',
      description: 'Working on web applications',
      summary: 'Experience summary',
      responsibilities: 'Development and testing',
      language_set: 'en',
      slug: 'senior-developer-test-company',
      skills: mockSkills,
      languageSets: []
   };

   beforeEach(() => {
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               switch (key) {
                  case 'ExperienceDetailsContent.pageHeader.title':
                     return 'Experience Details';
                  case 'ExperienceDetailsContent.pageHeader.description':
                     return 'View and edit the details of the experience.';
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
            render(<ExperienceDetailsContent experience={mockExperience} />);
         }).not.toThrow();
      });

      it('renders the root component with correct CSS class', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         const rootElement = screen.getByText('Experience Details').closest('.ExperienceDetailsContent');
         expect(rootElement).toBeInTheDocument();
         expect(rootElement).toHaveClass('ExperienceDetailsContent');
         expect(rootElement).toHaveClass('mock-experience-details-content-class');
      });

      it('renders page header component', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
      });

      it('renders section wrapper', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         const sectionElement = screen.getByTestId('container').closest('section');
         expect(sectionElement).toBeInTheDocument();
      });

      it('renders container component', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(screen.getByTestId('container')).toBeInTheDocument();
      });

      it('renders content sidebar', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
      });
   });

   describe('Context provider integration', () => {
      it('wraps content with ExperienceDetailsProvider', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(screen.getByTestId('experience-details-provider')).toBeInTheDocument();
      });

      it('passes experience data to context provider', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         const provider = screen.getByTestId('experience-details-provider');
         
         const experienceData = provider.getAttribute('data-experience');
         expect(experienceData).toBeTruthy();
         
         const parsedExperience = JSON.parse(experienceData!);
         expect(parsedExperience.id).toBe(mockExperience.id);
         expect(parsedExperience.title).toBe(mockExperience.title);
         expect(parsedExperience.company.company_name).toBe(mockExperience.company.company_name);
      });

      it('passes all experience properties to context provider', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         const provider = screen.getByTestId('experience-details-provider');
         
         const experienceData = provider.getAttribute('data-experience');
         const parsedExperience = JSON.parse(experienceData!);
         
         expect(parsedExperience.status).toBe('published');
         expect(parsedExperience.type).toBe('full_time');
         expect(parsedExperience.position).toBe('Senior Frontend Developer');
         expect(parsedExperience.skills).toHaveLength(1);
      });
   });

   describe('Section components rendering', () => {
      it('renders ExperienceDetailsSection component', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(screen.getByTestId('experience-details-section')).toBeInTheDocument();
         expect(screen.getByText('Experience Details Section Component')).toBeInTheDocument();
      });

      it('renders ExperienceSetsSection component', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(screen.getByTestId('experience-sets-section')).toBeInTheDocument();
         expect(screen.getByText('Experience Sets Section Component')).toBeInTheDocument();
      });

      it('renders ExperienceDetailsSidebar component', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(screen.getByTestId('experience-details-sidebar')).toBeInTheDocument();
         expect(screen.getByText('Experience Details Sidebar Component')).toBeInTheDocument();
      });

      it('renders main content and sidebar in correct layout structure', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         const contentSidebar = screen.getByTestId('content-sidebar');
         const detailsSection = screen.getByTestId('experience-details-section');
         const setsSection = screen.getByTestId('experience-sets-section');
         const sidebar = screen.getByTestId('experience-details-sidebar');
         
         expect(contentSidebar).toContainElement(detailsSection);
         expect(contentSidebar).toContainElement(setsSection);
         expect(contentSidebar).toContainElement(sidebar);
      });

      it('places components in correct sidebar sections', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         expect(screen.getByTestId('sidebar-section-0')).toContainElement(screen.getByTestId('experience-details-section'));
         expect(screen.getByTestId('sidebar-section-0')).toContainElement(screen.getByTestId('experience-sets-section'));
         expect(screen.getByTestId('sidebar-section-1')).toContainElement(screen.getByTestId('experience-details-sidebar'));
      });
   });

   describe('Text resources integration', () => {
      it('uses text resources for page header title', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(screen.getByText('Experience Details')).toBeInTheDocument();
         expect(screen.getByTestId('page-title')).toHaveTextContent('Experience Details');
      });

      it('uses text resources for page header description', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(screen.getByText('View and edit the details of the experience.')).toBeInTheDocument();
         expect(screen.getByTestId('page-description')).toHaveTextContent('View and edit the details of the experience.');
      });

      it('calls useTextResources with correct texts module', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         expect(mockUseTextResources).toHaveBeenCalled();
      });

      it('calls getText with correct keys for title and description', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'ExperienceDetailsContent.pageHeader.title':
                  return 'Experience Details';
               case 'ExperienceDetailsContent.pageHeader.description':
                  return 'View and edit the details of the experience.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<ExperienceDetailsContent experience={mockExperience} />);

         expect(mockGetText).toHaveBeenCalledWith('ExperienceDetailsContent.pageHeader.title');
         expect(mockGetText).toHaveBeenCalledWith('ExperienceDetailsContent.pageHeader.description');
      });
   });

   describe('Experience data variations', () => {
      it('handles experience with minimal required data', () => {
         const minimalExperience: ExperienceData = {
            ...mockExperience,
            title: undefined,
            description: undefined,
            summary: undefined,
            responsibilities: undefined,
            skills: [],
            languageSets: []
         };

         expect(() => {
            render(<ExperienceDetailsContent experience={minimalExperience} />);
         }).not.toThrow();

         expect(screen.getByTestId('experience-details-section')).toBeInTheDocument();
         expect(screen.getByTestId('experience-sets-section')).toBeInTheDocument();
         expect(screen.getByTestId('experience-details-sidebar')).toBeInTheDocument();
      });

      it('handles experience with multiple language sets', () => {
         const experienceWithLanguageSets: ExperienceData = {
            ...mockExperience,
            languageSets: [
               {
                  id: 2,
                  created_at: new Date('2023-01-01T00:00:00.000Z'),
                  schemaName: 'experiences_schema',
                  tableName: 'experiences',
                  description: 'Descrição da experiência em português',
                  position: 'Desenvolvedor Frontend Sênior',
                  language_set: 'pt'
               }
            ]
         };

         render(<ExperienceDetailsContent experience={experienceWithLanguageSets} />);
         
         const provider = screen.getByTestId('experience-details-provider');
         const experienceData = JSON.parse(provider.getAttribute('data-experience')!);
         expect(experienceData.languageSets).toHaveLength(1);
      });

      it('handles experience with updated_at date', () => {
         const updatedExperience: ExperienceData = {
            ...mockExperience,
            updated_at: new Date('2024-01-01T00:00:00.000Z')
         };

         render(<ExperienceDetailsContent experience={updatedExperience} />);
         
         const provider = screen.getByTestId('experience-details-provider');
         const experienceData = JSON.parse(provider.getAttribute('data-experience')!);
         expect(experienceData.updated_at).toBe('2024-01-01T00:00:00.000Z');
      });
   });

   describe('Component structure and layout', () => {
      it('maintains proper component hierarchy', () => {
         const { container } = render(<ExperienceDetailsContent experience={mockExperience} />);
         
         const provider = screen.getByTestId('experience-details-provider');
         const rootDiv = container.querySelector('.ExperienceDetailsContent') as HTMLElement;
         const pageHeader = screen.getByTestId('page-header');
         const section = container.querySelector('section') as HTMLElement;
         
         expect(provider).toContainElement(rootDiv);
         expect(rootDiv).toContainElement(pageHeader);
         expect(rootDiv).toContainElement(section);
      });

      it('renders content within section and container', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         const section = screen.getByTestId('container').closest('section');
         const containerElement = screen.getByTestId('container');
         const contentSidebar = screen.getByTestId('content-sidebar');
         
         expect(section).toContainElement(containerElement);
         expect(containerElement).toContainElement(contentSidebar);
      });

      it('renders semantic page structure', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         const title = screen.getByRole('heading', { level: 1 });
         expect(title).toBeInTheDocument();
         expect(title).toHaveTextContent('Experience Details');

         const section = screen.getByTestId('container').closest('section');
         expect(section).toBeInTheDocument();
      });

      it('has correct CSS class from parseCSS helper', () => {
         import('@/helpers/parse.helpers').then(({ parseCSS }) => {
            render(<ExperienceDetailsContent experience={mockExperience} />);
            
            expect(parseCSS).toHaveBeenCalledWith('ExperienceDetailsContent', 'mock-experience-details-content-class');
         });
      });
   });

   describe('Text resources variations', () => {
      it('handles different text resource values', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'ExperienceDetailsContent.pageHeader.title':
                        return 'Custom Experience Title';
                     case 'ExperienceDetailsContent.pageHeader.description':
                        return 'Custom experience description text.';
                     default:
                        return 'Default Text';
                  }
               })
            }
         });

         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         expect(screen.getByText('Custom Experience Title')).toBeInTheDocument();
         expect(screen.getByText('Custom experience description text.')).toBeInTheDocument();
      });

      it('handles Portuguese text resources', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'ExperienceDetailsContent.pageHeader.title':
                        return 'Detalhes da Experiência';
                     case 'ExperienceDetailsContent.pageHeader.description':
                        return 'Visualizar e editar os detalhes da experiência.';
                     default:
                        return 'Texto Padrão';
                  }
               })
            }
         });

         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         expect(screen.getByText('Detalhes da Experiência')).toBeInTheDocument();
         expect(screen.getByText('Visualizar e editar os detalhes da experiência.')).toBeInTheDocument();
      });
   });

   describe('Error handling and edge cases', () => {
      it('handles text resources failure gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  if (key === 'ExperienceDetailsContent.pageHeader.title') return 'Fallback Title';
                  if (key === 'ExperienceDetailsContent.pageHeader.description') return 'Fallback Description';
                  return 'Fallback Text';
               })
            }
         });
         
         expect(() => {
            render(<ExperienceDetailsContent experience={mockExperience} />);
         }).not.toThrow();
         
         expect(screen.getByText('Fallback Title')).toBeInTheDocument();
         expect(screen.getByText('Fallback Description')).toBeInTheDocument();
      });

      it('handles experience with empty company name gracefully', () => {
         const experienceWithEmptyCompany: ExperienceData = {
            ...mockExperience,
            company: {
               ...mockCompany,
               company_name: ''
            }
         };

         expect(() => {
            render(<ExperienceDetailsContent experience={experienceWithEmptyCompany} />);
         }).not.toThrow();

         expect(screen.getByTestId('experience-details-section')).toBeInTheDocument();
      });

      it('handles experience with no optional fields', () => {
         const minimalExperience: ExperienceData = {
            id: 1,
            created_at: new Date('2023-01-01T00:00:00.000Z'),
            schemaName: 'experiences_schema',
            tableName: 'experiences',
            company: mockCompany,
            company_id: 1,
            end_date: new Date('2023-12-31'),
            start_date: new Date('2023-01-01'),
            status: 'draft' as const,
            type: 'internship' as const,
            skills: [],
            languageSets: []
         };

         expect(() => {
            render(<ExperienceDetailsContent experience={minimalExperience} />);
         }).not.toThrow();

         expect(screen.getByTestId('experience-details-section')).toBeInTheDocument();
      });
   });

   describe('Integration with sub-components', () => {
      it('provides context to all child components', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         const provider = screen.getByTestId('experience-details-provider');
         const detailsSection = screen.getByTestId('experience-details-section');
         const setsSection = screen.getByTestId('experience-sets-section');
         const sidebar = screen.getByTestId('experience-details-sidebar');
         
         expect(provider).toContainElement(detailsSection);
         expect(provider).toContainElement(setsSection);
         expect(provider).toContainElement(sidebar);
      });

      it('maintains correct layout structure for responsive design', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         const contentSidebar = screen.getByTestId('content-sidebar');
         expect(contentSidebar).toBeInTheDocument();
         
         // Verify Fragment structure for main content
         expect(screen.getByTestId('sidebar-section-0')).toContainElement(screen.getByTestId('experience-details-section'));
         expect(screen.getByTestId('sidebar-section-0')).toContainElement(screen.getByTestId('experience-sets-section'));
         
         // Verify sidebar placement
         expect(screen.getByTestId('sidebar-section-1')).toContainElement(screen.getByTestId('experience-details-sidebar'));
      });
   });

   describe('Accessibility', () => {
      it('has proper heading structure', () => {
         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
         expect(heading).toHaveTextContent('Experience Details');
      });

      it('maintains semantic HTML structure', () => {
         const { container } = render(<ExperienceDetailsContent experience={mockExperience} />);
         
         // Check for proper section structure
         const section = container.querySelector('section') as HTMLElement;
         expect(section).toBeInTheDocument();
         
         // Check for proper div structure
         const rootDiv = container.querySelector('.ExperienceDetailsContent') as HTMLElement;
         expect(rootDiv).toBeInTheDocument();
         
         // Verify heading is accessible
         const heading = screen.getByRole('heading');
         expect(heading).toBeInTheDocument();
      });

      it('uses semantic section element for main content', () => {
         const { container } = render(<ExperienceDetailsContent experience={mockExperience} />);
         
         const section = container.querySelector('section') as HTMLElement;
         expect(section).toBeInTheDocument();
         
         const containerElement = screen.getByTestId('container');
         expect(section).toContainElement(containerElement);
      });
   });

   describe('Performance and optimization', () => {
      it('only calls text resources once per render', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'ExperienceDetailsContent.pageHeader.title':
                  return 'Experience Details';
               case 'ExperienceDetailsContent.pageHeader.description':
                  return 'View and edit the details of the experience.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<ExperienceDetailsContent experience={mockExperience} />);
         
         // Should call getText exactly twice - once for title, once for description
         expect(mockGetText).toHaveBeenCalledTimes(2);
      });

      it('maintains component purity with same experience data', () => {
         const { container: container1 } = render(<ExperienceDetailsContent experience={mockExperience} />);
         const { container: container2 } = render(<ExperienceDetailsContent experience={mockExperience} />);
         
         expect(container1.innerHTML).toBe(container2.innerHTML);
      });
   });
});
